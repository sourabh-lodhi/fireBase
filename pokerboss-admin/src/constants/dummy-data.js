export const donutChartData = [
  {
    kind: "Direct",
    share: 60,
    color: " #607de6",
  },
  {
    kind: "Organic",
    share: 25,
    color: "#7e91d6",
  },
  {
    kind: "Referral",
    share: 15,
    color: "#acb8e3",
  },
];
export const barChartData = [10, 5, 8, 13, 10, 34, 53, 43, 23, 30];

export const barCategoryData = [
  "oct 1",
  "oct 2",
  "oct 3",
  "oct 4",
  "oct 5",
  "oct 6",
  "oct 7",
  "oct 8",
  "oct 9",
  "oct 10",
];

export const authProps = [
  {
    heading: "Authentication",
    icon: "user",
    body: [
      { href: "/", value: "Sign In" },
      { href: "/sign-up", value: "Sign Up" },
      { href: "/password-reset", value: "Password Reset" },
    ],
  },
];

export const componentsProps = [
  {
    heading: "Components",
    icon: "book-open",
    body: [
      { href: "/custom-components/accordion", value: "Accordion" },
      { href: "/custom-components/pagination", value: "Pagination" },
      { href: "/custom-components/placeholder", value: "Placeholder" },
      { href: "/custom-components/custom-navbar", value: "Navbar" },
    ],
  },
];

export const customArrordionData = [
  {
    heading: "Home",
    icon: "home",
    body: [
      { href: "/dasboard", value: "Lorem Ipsum" },
      { href: "/dasboard", value: "Dummy Data" },
    ],
  },
  {
    heading: "Info",
    icon: "info",
    body: [
      { href: "/dasboard", value: "Lorem Ipsum" },
      { href: "/dasboard", value: "Dummy Data" },
    ],
  },
];

export const SideNavFirstAccordion = [
  {
    heading: "Dashboards",
    icon: "home",
    body: [
      { href: "/", value: "Default" },
      { href: "/", value: "Project Management" },
    ],
  },
  {
    heading: "Pages",
    icon: "file",
    body: [
      { href: "/", value: "Account" },
      { href: "/", value: "CRM" },
    ],
  },
];

export const commonText = {
  resetLinkText: "Click on the below link to reset password",
};

export const kendoGridData = [
  {
    ProductID: 1,
    ProductName: "Chai",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "10 boxes x 20 bags",
    UnitPrice: 18.0,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
  },
  {
    ProductID: 2,
    ProductName: "Chang",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "24 - 12 oz bottles",
    UnitPrice: 19.0,
    UnitsInStock: 17,
    UnitsOnOrder: 40,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
  },
  {
    ProductID: 3,
    ProductName: "Aniseed Syrup",
    SupplierID: 1,
    CategoryID: 2,
    QuantityPerUnit: "12 - 550 ml bottles",
    UnitPrice: 10.0,
    UnitsInStock: 13,
    UnitsOnOrder: 70,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 4,
    ProductName: "Chef Anton's Cajun Seasoning",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "48 - 6 oz jars",
    UnitPrice: 22.0,
    UnitsInStock: 53,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 5,
    ProductName: "Chef Anton's Gumbo Mix",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "36 boxes",
    UnitPrice: 21.35,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 6,
    ProductName: "Grandma's Boysenberry Spread",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 8 oz jars",
    UnitPrice: 25.0,
    UnitsInStock: 120,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 7,
    ProductName: "Uncle Bob's Organic Dried Pears",
    SupplierID: 3,
    CategoryID: 7,
    QuantityPerUnit: "12 - 1 lb pkgs.",
    UnitPrice: 30.0,
    UnitsInStock: 15,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 7,
      CategoryName: "Produce",
      Description: "Dried fruit and bean curd",
    },
  },
  {
    ProductID: 8,
    ProductName: "Northwoods Cranberry Sauce",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 12 oz jars",
    UnitPrice: 40.0,
    UnitsInStock: 6,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 9,
    ProductName: "Mishi Kobe Niku",
    SupplierID: 4,
    CategoryID: 6,
    QuantityPerUnit: "18 - 500 g pkgs.",
    UnitPrice: 97.0,
    UnitsInStock: 29,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 6,
      CategoryName: "Meat/Poultry",
      Description: "Prepared meats",
    },
  },
  {
    ProductID: 10,
    ProductName: "Ikura",
    SupplierID: 4,
    CategoryID: 8,
    QuantityPerUnit: "12 - 200 ml jars",
    UnitPrice: 31.0,
    UnitsInStock: 31,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
  },
  {
    ProductID: 11,
    ProductName: "Queso Cabrales",
    SupplierID: 5,
    CategoryID: 4,
    QuantityPerUnit: "1 kg pkg.",
    UnitPrice: 21.0,
    UnitsInStock: 22,
    UnitsOnOrder: 30,
    ReorderLevel: 30,
    Discontinued: false,
    Category: {
      CategoryID: 4,
      CategoryName: "Dairy Products",
      Description: "Cheeses",
    },
  },
  {
    ProductID: 12,
    ProductName: "Queso Manchego La Pastora",
    SupplierID: 5,
    CategoryID: 4,
    QuantityPerUnit: "10 - 500 g pkgs.",
    UnitPrice: 38.0,
    UnitsInStock: 86,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 4,
      CategoryName: "Dairy Products",
      Description: "Cheeses",
    },
  },
  {
    ProductID: 13,
    ProductName: "Konbu",
    SupplierID: 6,
    CategoryID: 8,
    QuantityPerUnit: "2 kg box",
    UnitPrice: 6.0,
    UnitsInStock: 24,
    UnitsOnOrder: 0,
    ReorderLevel: 5,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
  },
  {
    ProductID: 14,
    ProductName: "Tofu",
    SupplierID: 6,
    CategoryID: 7,
    QuantityPerUnit: "40 - 100 g pkgs.",
    UnitPrice: 23.25,
    UnitsInStock: 35,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 7,
      CategoryName: "Produce",
      Description: "Dried fruit and bean curd",
    },
  },
  {
    ProductID: 15,
    ProductName: "Genen Shouyu",
    SupplierID: 6,
    CategoryID: 2,
    QuantityPerUnit: "24 - 250 ml bottles",
    UnitPrice: 15.5,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 5,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 16,
    ProductName: "Pavlova",
    SupplierID: 7,
    CategoryID: 3,
    QuantityPerUnit: "32 - 500 g boxes",
    UnitPrice: 17.45,
    UnitsInStock: 29,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 17,
    ProductName: "Alice Mutton",
    SupplierID: 7,
    CategoryID: 6,
    QuantityPerUnit: "20 - 1 kg tins",
    UnitPrice: 39.0,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 6,
      CategoryName: "Meat/Poultry",
      Description: "Prepared meats",
    },
  },
  {
    ProductID: 18,
    ProductName: "Carnarvon Tigers",
    SupplierID: 7,
    CategoryID: 8,
    QuantityPerUnit: "16 kg pkg.",
    UnitPrice: 62.5,
    UnitsInStock: 42,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
  },
  {
    ProductID: 19,
    ProductName: "Teatime Chocolate Biscuits",
    SupplierID: 8,
    CategoryID: 3,
    QuantityPerUnit: "10 boxes x 12 pieces",
    UnitPrice: 9.2,
    UnitsInStock: 25,
    UnitsOnOrder: 0,
    ReorderLevel: 5,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 20,
    ProductName: "Sir Rodney's Marmalade",
    SupplierID: 8,
    CategoryID: 3,
    QuantityPerUnit: "30 gift boxes",
    UnitPrice: 81.0,
    UnitsInStock: 40,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 21,
    ProductName: "Sir Rodney's Scones",
    SupplierID: 8,
    CategoryID: 3,
    QuantityPerUnit: "24 pkgs. x 4 pieces",
    UnitPrice: 10.0,
    UnitsInStock: 3,
    UnitsOnOrder: 40,
    ReorderLevel: 5,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 22,
    ProductName: "Gustaf's Knäckebröd",
    SupplierID: 9,
    CategoryID: 5,
    QuantityPerUnit: "24 - 500 g pkgs.",
    UnitPrice: 21.0,
    UnitsInStock: 104,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 5,
      CategoryName: "Grains/Cereals",
      Description: "Breads, crackers, pasta, and cereal",
    },
  },
  {
    ProductID: 23,
    ProductName: "Tunnbröd",
    SupplierID: 9,
    CategoryID: 5,
    QuantityPerUnit: "12 - 250 g pkgs.",
    UnitPrice: 9.0,
    UnitsInStock: 61,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 5,
      CategoryName: "Grains/Cereals",
      Description: "Breads, crackers, pasta, and cereal",
    },
  },
  {
    ProductID: 24,
    ProductName: "Guaraná Fantástica",
    SupplierID: 10,
    CategoryID: 1,
    QuantityPerUnit: "12 - 355 ml cans",
    UnitPrice: 4.5,
    UnitsInStock: 20,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
  },
  {
    ProductID: 25,
    ProductName: "NuNuCa Nuß-Nougat-Creme",
    SupplierID: 11,
    CategoryID: 3,
    QuantityPerUnit: "20 - 450 g glasses",
    UnitPrice: 14.0,
    UnitsInStock: 76,
    UnitsOnOrder: 0,
    ReorderLevel: 30,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 26,
    ProductName: "Gumbär Gummibärchen",
    SupplierID: 11,
    CategoryID: 3,
    QuantityPerUnit: "100 - 250 g bags",
    UnitPrice: 31.23,
    UnitsInStock: 15,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 27,
    ProductName: "Schoggi Schokolade",
    SupplierID: 11,
    CategoryID: 3,
    QuantityPerUnit: "100 - 100 g pieces",
    UnitPrice: 43.9,
    UnitsInStock: 49,
    UnitsOnOrder: 0,
    ReorderLevel: 30,
    Discontinued: false,
    Category: {
      CategoryID: 3,
      CategoryName: "Confections",
      Description: "Desserts, candies, and sweet breads",
    },
  },
  {
    ProductID: 28,
    ProductName: "Rössle Sauerkraut",
    SupplierID: 12,
    CategoryID: 7,
    QuantityPerUnit: "25 - 825 g cans",
    UnitPrice: 45.6,
    UnitsInStock: 26,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 7,
      CategoryName: "Produce",
      Description: "Dried fruit and bean curd",
    },
  },
  {
    ProductID: 29,
    ProductName: "Thüringer Rostbratwurst",
    SupplierID: 12,
    CategoryID: 6,
    QuantityPerUnit: "50 bags x 30 sausgs.",
    UnitPrice: 123.79,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 6,
      CategoryName: "Meat/Poultry",
      Description: "Prepared meats",
    },
  },
  {
    ProductID: 30,
    ProductName: "Nord-Ost Matjeshering",
    SupplierID: 13,
    CategoryID: 8,
    QuantityPerUnit: "10 - 200 g glasses",
    UnitPrice: 25.89,
    UnitsInStock: 10,
    UnitsOnOrder: 0,
    ReorderLevel: 15,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
  },
];
