using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using AutoMapper;
using API.Errors;
using API.Helpers;

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
    public async Task<ActionResult<Pagination<ProductDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
    {
      var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
      var countSpec = new ProductWithFiltersForCountSpecification(productParams);
      var totalItems = await _repo.productsRepo.CountAsync(countSpec);
      var products = await _repo.productsRepo.ListAsync(spec);

      var returnProds = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);

      return Ok(new Pagination<ProductDto>(productParams.PageIndex, productParams.PageSize, totalItems, returnProds));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
      var spec = new ProductsWithTypesAndBrandsSpecification(id);
      var product = await _repo.productsRepo.GetEntityWithSpec(spec);

      if (product == null) return NotFound(new ApiResponse(404));

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