"use client";
import Image from "next/image";
import React, { FC, useRef, useEffect, useCallback } from "react";
import Modal from "@/components/Modal/Modal";
import Spinner from "../Spinner/Spinner";
import { CakeType } from "@/app/page";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { cakeDetails, closeModal, cakeEdit } from "@/redux/slices/modalSlice";
import { removeCake } from "@/redux/slices/cakeDataSlice";
import { useDeleteCakeMutation } from "@/redux/api/cakeApi";
import { setLoggedIn, setLoggedOut } from "@/redux/slices/authSlice";
import { useGetAdminQuery } from "@/redux/api/adminApi";
import { formatDateBS } from "@/utils/formatDate";
import toast from "react-hot-toast";

type CardProps = {
  cakeData: CakeType;
};

const Card: FC<CardProps> = ({ cakeData }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [deleteCake, { isLoading: isDeleting }] = useDeleteCakeMutation();
  const sortValue = useSelector((state: RootState) => state.cakeData.sortValue);

  const { modalType, isLoggedIn } = useSelector(
    (state: RootState) => ({
      modalType: state.modalType,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );

  const createdAt = new Date(modalType.selectedCake?.createdAt ?? new Date());
  const { data } = useGetAdminQuery();

  const isCakeDetails = modalType.value === "cakeDetails";

  const handleBorder = useCallback((hover: boolean) => {
    if (!divRef.current) return;
    divRef.current.classList.toggle("border-gray-500", hover);
    divRef.current.classList.toggle("border-transparent", !hover);
  }, []);

  const handleLogoutTimer = useCallback(() => {
    if (!data?.expiresIn) return;

    dispatch(setLoggedIn());
    const timer = setTimeout(() => dispatch(setLoggedOut()), data.expiresIn);

    return () => clearTimeout(timer);
  }, [data, dispatch]);

  useEffect(() => {
    handleLogoutTimer();
    if (isLoggedIn) dispatch(closeModal());
  }, [handleLogoutTimer, isLoggedIn, dispatch]);

  const buttonClass = (bg: string) =>
    ` ${bg} text-gray-700 font-bold px-4 py-2 rounded-lg shadow-md hover:brightness-110 transition h-10 ${
      isLoggedIn ? "w-25 text-sm" : "w-27 text-base"
    } cursor-pointer`;

  return (
    <div
      className="border border-transparent p-7 shadow-2xl relative flex flex-col items-center mt-10 transition-colors"
      ref={divRef}
      onMouseOver={() => handleBorder(true)}
      onMouseOut={() => handleBorder(false)}
    >
      {!isDeleting ? (
        <Image
          src={cakeData.image}
          alt={cakeData.name}
          width={250}
          height={250}
          className="w-[250px] h-[250px] object-cover"
          loading="lazy"
        />
      ) : (
        <Spinner size={200} />
      )}

      <div className="flex gap-2 absolute top-75">
        <button
          aria-label="View cake"
          className={buttonClass("bg-yellow-300")}
          onClick={() => dispatch(cakeDetails(cakeData))}
        >
          Otvori 🎂
        </button>

        {isLoggedIn && (
          <>
            <button
              aria-label="Edit cake"
              className={buttonClass("bg-green-300")}
              onClick={() => dispatch(cakeEdit(cakeData))}
            >
              Uredi 🍰
            </button>
            <button
              aria-label="Delete cake"
              className={buttonClass("bg-red-400")}
              onClick={async () => {
                const [key, value] = sortValue.split("-");
                const sortedBy = { [key]: value };
                await deleteCake({
                  id: cakeData.id,
                  sortedBy: JSON.stringify(sortedBy),
                }).unwrap();
                dispatch(removeCake(cakeData.id));
                toast.success("Torta uspješno izbrisana");
              }}
            >
              Izbriši 🗑️
            </button>
          </>
        )}
      </div>

      {isCakeDetails && (
        <Modal
          isModalOpen={isCakeDetails}
          closeModal={() => dispatch(closeModal())}
          title="Detalji 🎂"
        >
          <p>
            <strong>Naziv: </strong>
            {modalType.selectedCake?.name ?? "Name"}
          </p>
          <hr />
          <p className="mt-2">
            <strong>Cijena: </strong>
            {modalType.selectedCake?.price ?? "Price"} KM
          </p>
          <hr />
          <p className="mt-2">
            <strong>Objavljeno: </strong>
            {formatDateBS(createdAt)}
          </p>
          <hr />
          <p className="mt-2">
            <strong>Opis: </strong>
            {modalType.selectedCake?.description ?? "Description"}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default React.memo(Card);
