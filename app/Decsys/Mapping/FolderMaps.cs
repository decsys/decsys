using AutoMapper;
using Decsys.Models;

namespace Decsys.Mapping;

public class FolderMaps : Profile
{
    public FolderMaps()
    {
        CreateMap<Folder, Data.Entities.Mongo.Folder>();

        CreateMap<Data.Entities.Mongo.Folder, Folder>();
    }

}
