using System;

namespace TripTales.Application.Dto
{
    public record CommentCmd
    (
        string text,
        Guid postGuid
    );
}
