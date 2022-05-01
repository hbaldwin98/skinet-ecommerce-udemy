using Core.Entities;

namespace Core.Interfaces
{
  public interface IUnitOfWork
  {
    IGenericRepository<Product> productsRepo { get; }
    IGenericRepository<ProductBrand> productBrandRepo { get; }
    IGenericRepository<ProductType> productTypeRepo { get; }
  }
}