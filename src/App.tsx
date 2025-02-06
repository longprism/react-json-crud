import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  interface ListDataType {
    id: number | string;
    name: string;
    email: string;
    password: string;
    gender: string;
    is_married: boolean;
    address: string;
  }

  const [list, setList] = useState<ListDataType[]>([]);
  const [load, setLoad] = useState(true);
  const [edit, setEdit] = useState<string | number | null>(null);

  useEffect(() => {
    readData();
  }, []);

  // read

  const readData = () => {
    setLoad(true);
    axios
      .get("http://localhost:8000/data")
      .then((res) => {
        setList(res.data);
        setLoad(false);
      })
      .catch((err) => {
        window.alert(err);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  // create

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [marital, setMarital] = useState(false);
  const [address, setAddress] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/data", {
        name,
        email,
        password,
        gender,
        marital,
        address,
      })
      .then(() => {
        readData();
        setEdit(null);
        setName("");
        setEmail("");
        setPassword("");
        setGender("");
        setMarital(false);
        setAddress("");
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  // update

  const handleUpdate = (id: string | number | null) => {
    if (id === null) return;
    axios
      .put(`http://localhost:8000/data/${id}`, {
        name,
        email,
        password,
        gender,
        marital,
        address,
      })
      .then((res) => {
        setList(list.map((item) => (item.id === id ? res.data : item)));
        setEdit(null);
        setName("");
        setEmail("");
        setPassword("");
        setGender("");
        setMarital(false);
        setAddress("");
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  const cancelUpdate = () => {
    setEdit(null);
    setName("");
    setEmail("");
    setPassword("");
    setGender("");
    setMarital(false);
    setAddress("");
  };

  // delete

  const handleDelete = (id: string | number) => {
    axios
      .delete(`http://localhost:8000/data/${id}`)
      .then(() => {
        readData();
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  return (
    <>
      <div className="text-2xl mb-10">Simple CRUD App</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (edit !== null) {
            handleUpdate(edit);
          } else {
            handleSubmit(e);
          }
          cancelUpdate();
        }}
      >
        <div className="flex flex-col space-y-5 w-full">
          <div className="flex flex-row items-center space-x-4 mx-auto">
            <label className="font-bold underline" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            />
            <label className="font-bold underline" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            />
            <label className="font-bold underline" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-1 rounded-md"
            />
          </div>
          <div className="flex flex-row items-center space-x-4 mx-auto">
            <label className="font-bold underline" htmlFor="gender">
              Gender
            </label>
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
            />
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            <label htmlFor="female">Female</label>
            <label htmlFor="gender">Female</label>
            {/* break this sh */}
            <label className="font-bold underline" htmlFor="marital">
              Is Married?
            </label>
            <input
              type="checkbox"
              name="marital"
              id="marital"
              checked={marital}
              onChange={(e) => setMarital(e.target.checked)}
            />
            <label className="font-bold underline" htmlFor="marital">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="border border-gray-300 p-1 rounded-md"
            />
          </div>
          <div className="flex flex-row items-center mx-auto">
            <button
              type="submit"
              className="bg-blue-500 text-white p-1 rounded-md"
            >
              {edit !== null ? "Update" : "Submit"}
            </button>
            {edit !== null && (
              <button
                type="submit"
                className="bg-blue-500 text-white p-1 ml-3 rounded-md"
                onClick={cancelUpdate}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      {!load ? (
        <table className="table-fixed w-full my-10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Marital Status</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.gender}</td>
                <td>{item.is_married ? "✓" : "X"}</td>
                <td>{item.address}</td>
                <td className="flex flex-row space-x-2">
                  <button
                    onClick={() => {
                      setEdit(item.id);
                      setName(item.name);
                      setEmail(item.email);
                      setPassword(item.password);
                      setGender(item.gender);
                      setMarital(item.is_married);
                      setAddress(item.address);
                    }}
                    className="bg-blue-500 text-white p-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-2xl text-center my-10">Loading...</div>
      )}
    </>
  );
}

export default App;
