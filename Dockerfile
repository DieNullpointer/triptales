FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY src/TripTales.Application TripTales.Application
COPY src/TripTales.Webapi TripTales.Webapi

RUN dotnet restore "TripTales.Webapi"
RUN dotnet build "TripTales.Webapi" -c Release -o /app/release
RUN dotnet publish "TripTales.Webapi" -c Release -o /app/release

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final

EXPOSE 80
EXPOSE 443
WORKDIR /app

COPY --from=build /app/release .
ENTRYPOINT ["dotnet", "TripTales.Webapi.dll"]