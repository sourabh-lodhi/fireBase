"use client";
import { dataAPI } from "@/service-api";
import { sampleProducts } from "./sample";
let data = [...sampleProducts];

const generateId = (data) =>
  data.reduce((acc, current) => Math.max(acc, current.ProductID), 0) + 1;

export const insertItem = (item) => {
  item.ProductID = generateId(data);
  item.inEdit = false;
  data.push(item);
  return data;
};

export const getItems = () => {
  return data;
};

export const updateItem = async (item) => {
  const bodyData = item;
  await dataAPI.editUserData({ bodyData });
  const newData = await dataAPI.getData();

  return newData?.data?.data;
};

export const deleteItem = (item) => {
  // here i'll call the api to delete the item
  let index = data.findIndex((record) => record.ProductID === item.ProductID);
  data.splice(index, 1);
  return data;
};
