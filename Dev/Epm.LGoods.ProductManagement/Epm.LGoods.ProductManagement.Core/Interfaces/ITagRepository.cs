using Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public interface ITagRepository
    {
        Task AddTagAsync(Tag tag);
        Task<IEnumerable<Tag>> GetTagsAsync(string tagName, bool? published);
        Task<Tag> GetTagByIdAsync(int tagId);
        Task UpdateTagAsync(Tag tag);
        Task DeleteTagAsync(int tagId);

        Task<int> CountAsync();
    }
}
