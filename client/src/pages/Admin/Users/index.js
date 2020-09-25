import React, { useState, useEffect, useCallback } from "react";
import style from "./index.module.scss";
import Axios from "axios";
import CRUD from "./CRUD";
import { toAdmin, toGuest } from "services/user";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formikData, setFormikData] = useState(null);
  const getAll = useCallback(() => {
    Axios.get(`${process.env.REACT_APP_API}/users`).then(({ data }) => setUsers(data));
  }, []);
  const getById = useCallback((id) => {
    return Axios.get(`${process.env.REACT_APP_API}/users/${id}`).then(
      ({ data }) => data
    );
  }, []);
  const update = useCallback(({ id, name, email, password, role }) => {
    return Axios.put(`${process.env.REACT_APP_API}/users/${id}`, {
      name,
      email,
      password,
      role,
    }).then(({ data }) => data);
  }, []);

  const create = useCallback(({ name, email, password, role }) => {
    return Axios.post(`${process.env.REACT_APP_API}/users/`, {
      name,
      email,
      password,
      role,
    }).then(({ data }) => data);
  }, []);
  const remove = useCallback((id) => {
    return Axios.delete(`${process.env.REACT_APP_API}/users/${id}`).then(
      ({ data }) => data
    );
  }, []);

  const handleView = useCallback(
    (id) => {
      getById(id).then((initialValues) => {
        setFormikData({ initialValues, readOnly: true });
      });
    },
    [setFormikData, getById]
  );
  const handleUpdate = useCallback(
    (id) => {
      getById(id).then((initialValues) => {
        setFormikData({
          initialValues,
          onSubmit: ({ id, name, email, password, role }) => {
            update({ id, name, email, password, role }).then(() => {
              getAll();
            });
            setFormikData(null);
          },
          onPromote: async () => { await toAdmin(id); getAll(); setFormikData(null); },
          onDegrade: async () => { await toGuest(id); getAll(); setFormikData(null); },
          update: true,
        });
      });
    },
    [setFormikData, getById, getAll, update]
  );
  const handleCreate = useCallback(() => {
    setFormikData({
      initialValues: {
        name: "",
        email: "",
        password: "",
        role: "GUEST",
      },
      onSubmit: ({ name, email, password, passwordVerify, role }) => {
        if (password === passwordVerify) {
          create({ name, email, password, role }).then(() => {
            getAll();
          });
          setFormikData(null);
        }
      },
      create: true,
    });
  }, [setFormikData, create, getAll]);

  const handleDelete = useCallback(
    (id, name) => {
      var r = window.confirm(`Desea eliminar ${name}`);
      if (r === true) {
        remove(id)
          .then(() => getAll())
          .then(() => setFormikData(null));
      }
    },
    [setFormikData, getAll, remove]
  );

  useEffect(() => {
    getAll();
  }, [getAll]);

  return (
    <section>
      <table className={style.table}>
        <thead>
          <tr>
            <th style={{ width: "3rem" }}>Id:</th>
            <th>Nombre:</th>
            <th>Email:</th>
            <th style={{ width: "5rem" }}>Role:</th>
            <th style={{ width: "5rem" }}>Estado:</th>
            <th style={{ width: "11rem" }}>
              <button onClick={() => handleCreate()}>
                <i className="fas fa-plus"></i> Agregar
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {users !== undefined &&
            users.map(({ id, name, email, role, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td style={{ textTransform: "capitalize" }}>{name}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>{status}</td>
                <td style={{ display: "flex" }}>
                  <button onClick={() => handleView(id)}>
                    <i className="fas fa-search"></i>
                  </button>
                  <button onClick={() => handleUpdate(id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(id, name)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>{" "}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {formikData && (
        <CRUD formikData={formikData} onClose={() => setFormikData(null)} />
      )}
    </section>
  );
};

export default Users;
