export const categories = [
  { name: "All", slug: "all", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/23bced69-47ec-48ea-89d7-1b5a68d29bb6_VegPizza.png?ver=V0.0.1" },
  { name: "Cheese Lava", slug: "cheese-lava", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/2387751d-744a-4e62-b84a-fd8b5eea8c5c_CheeseLavaPullApart.png?ver=V0.0.1" },
  { name: "Sourdough Range", slug: "sourdough-range", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/98786ac3-1612-40c0-9760-dc6e5e2d2361_SourdoughPizza.png?ver=V0.0.1" },
  { name: "Big Big Pizza", slug: "big-big-pizza", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/ffabe9c9-6786-4501-8f16-f328cf9b7a8d_BigBigPizza_Normal.png?ver=V0.0.1" },
  { name: "Crazy Deals", slug: "crazy-deals", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/e396c20d-5eb1-42a3-8abf-98cac7d51d84_LoadedSaucyRange.png?ver=V0.0.1" },
  { name: "Veg Pizza", slug: "veg-pizza", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/23bced69-47ec-48ea-89d7-1b5a68d29bb6_VegPizza.png?ver=V0.0.1" },
  { name: "Pizza Mania", slug: "pizza-mania", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/256103bc-8a01-4637-86b3-d9e63e5aab26_PizzaManianew.png?ver=V0.0.1" },
  { name: "Garlic Bread & Dips", slug: "garlic-bread-dips", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/76ea3002-6964-4834-9d90-bb602184577c_garlicbread.jpg?ver=V0.0.1" },
  { name: "Cheese Volcano", slug: "cheese-volcano", img: "https://cdn.jflimages.co.in/nextgen-catalog/media/prod/Dominos/CategoriesV1/d4426039-5b76-45a9-8940-fc268f2fbab5_cheesevolcano.jpg?ver=V0.0.1" },
];

export function slugToCategory(slug) {
  return categories.find(c => c.slug === slug);
}

