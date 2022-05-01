using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{
  public class ProductsController : BaseAPIController
  {
    private readonly IUnitOfWork _repo;
    private readonly IMapper _mapper;
    public ProductsController(IUnitOfWork repo, IMapper mapper)
    {
      _mapper = mapper;
      _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts()
    {
      var spec = new ProductsWithTypesAndBrandsSpecification();

      var products = await _repo.productsRepo.ListAsync(spec);

      var returnProds = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);

      return Ok(returnProds);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
      var spec = new ProductsWithTypesAndBrandsSpecification(id);
      var product = await _repo.productsRepo.GetEntityWithSpec(spec);

      if (product == null) return NotFound("Product does not exist");

      var returnProd = _mapper.Map<Product, ProductDto>(product);

      return returnProd;
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
    {
      var brands = await _repo.productBrandRepo.ListAllAsync();

      return Ok(brands);
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
    {
      var types = await _repo.productTypeRepo.ListAllAsync();

      return Ok(types);
    }
  }
}