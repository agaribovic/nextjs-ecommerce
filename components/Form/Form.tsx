import { Eye, EyeOff } from "lucide-react";
import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useAddCakeMutation, useEditCakeMutation } from "@/redux/api/cakeApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useLoginAdminMutation } from "@/redux/api/adminApi";
import { setLoggedIn } from "@/redux/slices/authSlice";
import { useSendEmailMutation } from "@/redux/api/mailerApi";
import { updateCake, addNewCake } from "@/redux/slices/cakeDataSlice";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import { closeModal } from "@/redux/slices/modalSlice";

interface FormData {
  name?: string;
  price?: number;
  image?: string | File;
  description?: string;
  email?: string;
  password?: string;
  cakeTheme?: string;
  orderPrice?: string;
  numberOfPieces?: string;
  colorOfPieces?: string;
  delivery?: string;
  orderEmail?: string;
  phoneNumber?: string;
  additionalDescription?: string;
  paymentMethod?: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0.0,
    image: "",
    description: "",
    email: "",
    password: "",
    cakeTheme: "",
    orderPrice: "",
    numberOfPieces: "",
    colorOfPieces: "",
    delivery: "",
    orderEmail: "",
    phoneNumber: "",
    additionalDescription: "",
    paymentMethod: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const [addCake] = useAddCakeMutation();
  const [editCake] = useEditCakeMutation();
  const [loginAdmin] = useLoginAdminMutation();
  const [sendEmail] = useSendEmailMutation();

  const modalType = useSelector((state: RootState) => state.modalType);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const sortValue = useSelector((state: RootState) => state.cakeData.sortValue);
  const dispatch = useDispatch<AppDispatch>();

  const {
    name,
    price,
    image,
    description,
    email,
    password,
    cakeTheme,
    orderPrice,
    numberOfPieces,
    colorOfPieces,
    delivery,
    orderEmail,
    phoneNumber,
    additionalDescription,
    paymentMethod,
  } = formData;

  const isAddMode = modalType.value === "cakeAdd";
  const isEditMode = modalType.value === "cakeEdit";
  const isOrderMode = modalType.value === "cakeOrder";
  const isLoginMode = !isLoggedIn;

  const isAddInvalid = isAddMode && (!name || !price || !image || !description);
  const isEditInvalid = isEditMode && !name && !price && !image && !description;
  const isOrderInvalid =
    isOrderMode &&
    (!cakeTheme ||
      !orderPrice ||
      !numberOfPieces ||
      !colorOfPieces ||
      !delivery ||
      !orderEmail ||
      !phoneNumber ||
      !additionalDescription ||
      !paymentMethod);
  const isLoginInvalid = !email || !password;

  const btnDisabled =
    submitting ||
    (isLoginMode && !isOrderMode
      ? isLoginInvalid
      : isAddInvalid || isEditInvalid || isOrderInvalid);

  const getButtonText = () => {
    if (submitting) return <Spinner size={30} />;
    if (isLoginMode && !isOrderMode) return "Prijavi se";
    if (isAddMode) return "Dodaj";
    if (isEditMode) return "Uredi";
    if (isOrderMode) return "Naruči";
    return "Pošalji";
  };

  type InputElements =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

  const handleChange = (e: ChangeEvent<InputElements>) => {
    const target = e.target;
    const { name, value, type } = target;

    const newValue =
      type === "file" && target instanceof HTMLInputElement
        ? target.files?.[0] ?? ""
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    let message = "";

    try {
      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "price" || key === "image") return;
        if (value !== undefined && value !== null && value !== "") {
          formDataObj.append(key, String(value));
        }
      });

      const priceInput = numberRef.current as HTMLInputElement | null;
      const priceRaw = priceInput?.value;

      if (priceRaw && priceRaw !== "") {
        formDataObj.set("price", priceRaw);
      }

      if (image instanceof File) {
        formDataObj.append("file", image);
      }

      const [key, value] = sortValue.split("-");
      const sortedBy = { [key]: value };
      formDataObj.append("sortedBy", JSON.stringify(sortedBy));

      if (isLoginMode && !isOrderMode) {
        await loginAdmin({
          email: email ?? "",
          password: password ?? "",
        }).unwrap();
        dispatch(setLoggedIn());
        dispatch(closeModal());
        toast.success("Dobrodošla, Merisa :)");
        return;
      }

      if (isAddMode) {
        const newCake = await addCake(formDataObj).unwrap();
        dispatch(addNewCake(newCake));
        toast.success("Torta uspješno dodata");
      } else if (modalType.selectedCake) {
        const editedCake = await editCake({
          id: modalType.selectedCake.id,
          data: formDataObj,
        }).unwrap();
        dispatch(updateCake(editedCake));
        toast.success("Torta uspješno uređena");
      }

      if (isOrderMode) {
        await sendEmail(formDataObj).unwrap();
        toast.success("Narudžba uspješna!");
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      const action = isLoginMode ? "login" : isAddMode ? "add" : "edit";

      const messages: Record<string, string> = {
        login: "Pogrešan e-mail i/ili šifra",
        add: "Greška u dodavanju torte",
        edit: "Greška u uređivanju torte",
      };

      message = messages[action];

      if (message) toast.error(message);
    } finally {
      setSubmitting(false);
      !message && dispatch(closeModal());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 text-gray-900 -mt-4 text-center"
    >
      {!isLoginMode && (isAddMode || isEditMode) && (
        <>
          <div>
            <label htmlFor="name" className="block">
              Naziv:
            </label>
            <input
              type="text"
              name="name"
              defaultValue={modalType.selectedCake?.name}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Minnie mouse"
              required={isAddMode}
            />
          </div>
          <div>
            <label htmlFor="price" className="block">
              Cijena (BAM):
            </label>
            <input
              type="number"
              name="price"
              defaultValue={modalType.selectedCake?.price}
              onChange={handleChange}
              ref={numberRef}
              className="border rounded p-2 w-full"
              min="1"
              max="200"
              step="0.01"
              placeholder="11.50"
              required={isAddMode}
            />
          </div>

          <div>
            <label htmlFor="image" className="block">
              Slika:
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              ref={fileInputRef}
              className="border rounded p-2 w-full"
              required={isAddMode}
            />
          </div>

          <div>
            <label htmlFor="description" className="block">
              Opis:
            </label>
            <textarea
              name="description"
              placeholder="Minnie mouse papirna torta je..."
              onChange={handleChange}
              rows={4}
              cols={40}
              className="border rounded p-2 w-full"
              defaultValue={modalType.selectedCake?.description}
              required={isAddMode}
            />
          </div>
        </>
      )}
      {isLoginMode && !isOrderMode && (
        <>
          <div>
            <label htmlFor="email" className="block">
              E-mail:
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@example.com"
              className="border rounded p-2 w-full"
              defaultValue={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative w-full max-w-sm">
            <label htmlFor="password">Šifra:</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="************"
              className="border rounded p-2 w-full"
              defaultValue={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-1/13 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-800 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </>
      )}
      {isOrderMode && (
        <>
          <div>
            <label htmlFor="Cake Theme" className="block">
              Tema torte:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="cakeTheme"
              onChange={handleChange}
              value={formData.cakeTheme}
            >
              <option value=""></option>
              <option value="Frozen">Frozen</option>
              <option value="Paw Patrol">Paw Patrol</option>
              <option value="Barbie">Barbie</option>
              <option value="Minnie mouse">Minnie mouse</option>
              <option value="Spiderman">Spiderman</option>
              <option value="Nindža kornjače">Nindža kornjače</option>
              <option value="Cars">Cars</option>
              <option value="Mickey mouse">Mickey mouse</option>
              <option value="Minecraft">Minecraft</option>
              <option value="Ili po drugoj želji">Ili po drugoj želji</option>
            </select>
          </div>

          <div>
            <label htmlFor="Order Price" className="block">
              Cijena:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="orderPrice"
              onChange={handleChange}
              value={formData.orderPrice}
            >
              <option value=""></option>
              <option value="Bez slatkiša (1.5KM/komad)">
                Bez slatkiša (1.5KM/komad)
              </option>
              <option value="Sa slatkišima (ovisno o vrsti – 3KM / 3.5KM / 4KM komad)">
                Sa slatkišima (ovisno o vrsti – 3KM / 3.5KM / 4KM komad)
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="Number of Pieces" className="block">
              Broj komada:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="numberOfPieces"
              onChange={handleChange}
              value={formData.numberOfPieces}
            >
              <option value=""></option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="20">20</option>
              <option value="24">24</option>
              <option value="30">30</option>
              <option value="36">36</option>
            </select>
          </div>
          <div>
            <label htmlFor="Color of Pieces" className="block">
              Boja komada:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="colorOfPieces"
              onChange={handleChange}
              value={formData.colorOfPieces}
            >
              <option value=""></option>
              <option value="Šarena - sve boje">Šarena - sve boje</option>
              <option value="Bijela">Bijela</option>
              <option value="Žuta">Žuta</option>
            </select>
          </div>
          <div>
            <label htmlFor="Delivery" className="block">
              Preuzimanje:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="delivery"
              onChange={handleChange}
              value={formData.delivery}
            >
              <option value=""></option>
              <option value="Osobno preuzimanje trgovina">
                Osobno preuzimanje (plaćanje gotovinom)
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="Order E-mail" className="block">
              E-mail adresa:
            </label>
            <input
              type="email"
              className="border rounded p-2 w-full"
              name="orderEmail"
              onChange={handleChange}
              value={formData.orderEmail}
            />
          </div>

          <div>
            <label htmlFor="Phone Number" className="block">
              Broj telefona za kontakt:
            </label>
            <input
              type="tel"
              className="border rounded p-2 w-full"
              name="phoneNumber"
              onChange={handleChange}
              value={formData.phoneNumber}
            />
          </div>

          <div>
            <label htmlFor="Additional Description" className="block">
              Dodatni opis:
            </label>
            <textarea
              className="border rounded p-2 w-full"
              name="additionalDescription"
              onChange={handleChange}
              value={formData.additionalDescription}
            />
          </div>
          <div>
            <label htmlFor="Payment Method" className="block">
              Način plaćanja:
            </label>
            <select
              className="border rounded p-2 w-full"
              name="paymentMethod"
              onChange={handleChange}
              value={formData.paymentMethod}
            >
              <option value=""></option>
              <option value="Kod osobnog preuzimanja">
                Kod osobnog preuzimanja
              </option>
              <option value="Po pouzeću pošiljke">Po pouzeću pošiljke</option>
              <option value="Transakcijski po ponudi">
                Transakcijski po ponudi
              </option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        className={`bg-[#1B2533] text-white px-4 py-2 rounded w-32 h-12 ${
          btnDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#1B2533] cursor-pointer"
        }`}
        disabled={btnDisabled}
      >
        {getButtonText()}
      </button>
    </form>
  );
};

export default Form;
