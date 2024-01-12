"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { insertItem, getItems, updateItem, deleteItem } from "./service";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Loader from "@/components/loader/loader";
import { observer } from "mobx-react-lite";
import { userStore } from "@/mobx/stores/user-store";
const editField = "inEdit";

const Users = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    userStore.getAllUsersData();
  }, []);

  useEffect(() => {
    if (userStore?.allUsersData?.length > 0) {
      setIsLoading(false);
    }
  }, [userStore?.allUsersData]);

  const remove = (dataItem) => {
    setData([...deleteItem(dataItem)]);
  };
  const add = (dataItem) => {
    dataItem.inEdit = true;
    const newData = insertItem(dataItem);
    setData(newData);
  };
  const update = async (dataItem) => {
    dataItem.inEdit = false;
    const newData = await updateItem(dataItem);
    setData(newData);
  };

  // Local state operations
  const discard = () => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };
  const cancel = (dataItem) => {
    const originalItem = getItems().find(
      (p) => p.ProductID === dataItem.ProductID
    );
    const newData = data.map((item) =>
      item.ProductID === originalItem.ProductID ? originalItem : item
    );
    setData(newData);
  };
  const enterEdit = (dataItem) => {
    setData(
      data.map((item) =>
        item.uid === dataItem.uid
          ? {
              ...item,
              inEdit: true,
            }
          : item
      )
    );
  };
  const itemChange = (event) => {
    const newData = data.map((item) =>
      item.uid === event.dataItem.uid
        ? {
            ...item,
            [event.field || ""]: event.value,
          }
        : item
    );
    setData(newData);
  };
  const addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false,
    };
    setData([newDataItem, ...data]);
  };

  const goToNextPage = (dataItem) => {
    const reducerData = { uid: dataItem.uid };
    userStore?.addUserDetailPageId(reducerData);
    router.push("/dashboard/users/user-details");
  };
  const MyCommandCell = (props) => {
    const { dataItem } = props;
    const inEdit = dataItem[props.editField];
    const isNewItem = dataItem.status === undefined;
    return inEdit ? (
      <td className="k-command-cell">
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
          onClick={() =>
            isNewItem ? props.add(dataItem) : props.update(dataItem)
          }
        >
          {isNewItem ? "Add" : "Update"}
        </button>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
          onClick={() =>
            isNewItem ? props.discard(dataItem) : props.cancel(dataItem)
          }
        >
          {isNewItem ? "Discard" : "Cancel"}
        </button>
      </td>
    ) : (
      <td className="k-command-cell">
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
          onClick={() => props.edit(dataItem)}
        >
          Edits
        </button>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
          onClick={() =>
            confirm("Confirm deleting: " + dataItem.ProductName) &&
            props.remove(dataItem)
          }
        >
          Remove
        </button>
      </td>
    );
  };
  const MYNewPageCell = (props) => {
    const { dataItem } = props;
    return (
      <td className="k-command-cell">
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
          onClick={() => props.nextPage(dataItem)}
        >
          <FeatherIcon icon="more-vertical" size="17" />
        </button>
      </td>
    );
  };

  const CommandCell = (props) => (
    <MyCommandCell
      {...props}
      edit={enterEdit}
      remove={remove}
      add={add}
      discard={discard}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );
  const newPageCell = (props) => (
    <MYNewPageCell {...props} nextPage={goToNextPage} />
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="min-vh-100 bg-light">
      <p>Users</p>

      <Grid
        style={{
          height: "420px",
        }}
        data={userStore?.allUsersData}
        onItemChange={itemChange}
        editField={editField}
      >
        <GridToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={addNew}
          >
            Add new
          </button>
        </GridToolbar>
        <Column field="email" title="Email" width="250px" editable={false} />
        <Column field="username" title="Username" width="200px" />
        {/* <Column
          field="FirstOrderedOn"
          title="First Ordered"
          editor="date"
          format="{0:d}"
          width="150px"
        />
        <Column
          field="UnitsInStock"
          title="Units"
          width="120px"
          editor="numeric"
        /> */}
        <Column field="status" title="Status" width="100px" />
        <Column cell={CommandCell} width="200px" />
        <Column cell={newPageCell} width="118px" />
      </Grid>
    </div>
  );
};

export default observer(Users);
