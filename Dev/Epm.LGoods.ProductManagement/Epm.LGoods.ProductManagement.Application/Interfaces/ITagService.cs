using Epm.LGoods.ProductManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface ITagService
    {
        Task AddTagAsync(TagDto tagDto);
        Task<IEnumerable<TagDto>> GetTagsAsync(string tagName, bool? published);
        Task<TagDto> GetTagByIdAsync(int tagId);
        Task UpdateTagAsync(TagDto tagDto);
        Task DeleteTagAsync(int tagId);
    }
}
