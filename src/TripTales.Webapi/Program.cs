using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Webapi.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddDbContext<TripTalesContext>(opt => opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "DataSource=TripTales.db"));
//builder.Services.AddDbContext<TripTalesContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("Default") ?? "Server=db;Database=TripTales;Trusted_Connection=True;"));

builder.Services.AddScoped<PostRepository>();
builder.Services.AddScoped<UserRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped(opt =>
{
    var adConfig = builder.Configuration.GetSection("AzureAd");
    var secret = builder.Configuration["Secret"];

    var httpContextAccessor = opt.GetRequiredService<IHttpContextAccessor>();
    var httpContext = httpContextAccessor.HttpContext ?? throw new ServiceException("No HTTP Context");
    var redirectUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}/{adConfig["RedirectUrl"]}";
    return new AzureAdClient(
        tenantId: adConfig["TenantId"],
        clientId: adConfig["ClientId"],
        redirectUrl: redirectUrl,
        clientSecret: adConfig["ClientSecret"],
        scope: adConfig["Scope"],
        secret: secret,
        db: opt.GetRequiredService<TripTalesContext>());
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.OnAppendCookie = cookieContext =>
    {
        cookieContext.CookieOptions.Secure = builder.Environment.IsDevelopment() ? true : false;
        cookieContext.CookieOptions.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict;
    };
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return System.Threading.Tasks.Task.CompletedTask;
        };
        o.LoginPath = "/account/signin";
        o.AccessDeniedPath = "/account/signin";
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextDevserver",
        builder => builder.SetIsOriginAllowed(origin => new System.Uri(origin).IsLoopback)
            .AllowAnyHeader().AllowAnyMethod().AllowCredentials());
});

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue; // Limit on individual form values
    options.MultipartBodyLengthLimit = long.MaxValue; // Limit on form body size
    options.MemoryBufferThreshold = int.MaxValue; // Buffering limit
    options.MultipartHeadersLengthLimit = int.MaxValue; // Limit on the length of headers of individual parts
});



var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    using (var db = scope.ServiceProvider.GetRequiredService<TripTalesContext>())
    {
        if (app.Environment.IsDevelopment())
            db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
        if (app.Environment.IsDevelopment())
            db.Seed();
    }
}




app.UseHttpsRedirection();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowNextDevserver");
}
app.UseCookiePolicy();
// if pictures directory does not exist, create it
Console.WriteLine(Path.Combine(builder.Environment.ContentRootPath, "Pictures"));
if (!Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "Pictures")))
{
    Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "Pictures"));
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Pictures")),
    RequestPath = "/Pictures"
});
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
//app.MapFallbackToFile("index.html");
app.Run();