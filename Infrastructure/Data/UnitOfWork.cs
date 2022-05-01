using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
  public class UnitOfWork : IUnitOfWork
  {
    private readonly DataContext _context;
    public UnitOfWork(DataContext context)
    {
      _context = context;
    }

    public IGenericRepository<Product> productsRepo => new GenericRepository<Product>(_context);

    public IGenericRepository<ProductBrand> productBrandRepo => new GenericRepository<ProductBrand>(_context);

    public IGenericRepository<ProductType> productTypeRepo => new GenericRepository<ProductType>(_context);
  }
}