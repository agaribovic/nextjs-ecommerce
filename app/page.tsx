"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import Spinner from "@/components/Spinner/Spinner";
import { Overlay } from "@/components/Overlay/Overlay";
import { useGetCakesQuery } from "@/redux/api/cakeApi";
import { setCakeData } from "@/redux/slices/cakeDataSlice";
import { closeModal } from "@/redux/slices/modalSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useInfiniteScroll } from "@/utils/useInfiniteScroll";

export type CakeType = {
  id: number;
  name: string;
  price: number;
  image: string;
  createdAt: string;
  description: string;
};

const Home: FC = () => {
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined
  );

  const dispatch = useDispatch<AppDispatch>();
  const sortedCakes = useSelector(
    (state: RootState) => state.cakeData.sortedCakes
  );

  const { modalType, isLoggedIn } = useSelector(
    (state: RootState) => ({
      modalType: state.modalType,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );

  const cakesRef = useRef<CakeType[]>([]);
  useEffect(() => {
    cakesRef.current = sortedCakes ?? [];
  }, [sortedCakes]);

  useEffect(() => {
    if (
      sortedCakes &&
      sortedCakes.length === 0 &&
      currentCursor !== undefined
    ) {
      setCurrentCursor(undefined);
    }
  }, [sortedCakes, currentCursor]);

  const {
    data: cakeData,
    isLoading,
    isError,
  } = useGetCakesQuery({
    cursor: currentCursor,
    limit: 10,
  });

  const mergeCakes = useCallback(
    (existing: CakeType[], incoming: CakeType[]) => {
      const map = new Map(existing.map((c) => [c.id, c]));
      incoming.forEach((c) => map.set(c.id, c));
      return Array.from(map.values());
    },
    []
  );

  useEffect(() => {
    if (!cakeData || cakeData.items.length === 0) return;

    const mergedCakes = mergeCakes(cakesRef.current, cakeData.items);
    dispatch(setCakeData(mergedCakes));
  }, [cakeData, dispatch, mergeCakes]);

  const isCakeForm = ["cakeAdd", "cakeEdit", "cakeOrder"].includes(
    modalType.value ?? ""
  );

  const getModalTitle = () => {
    if (!isLoggedIn && modalType.value !== "cakeOrder") return "Prijava 🎂";
    if (modalType.value === "cakeAdd") return "Dodaj 🎂";
    if (modalType.value === "cakeEdit") return "Uredi 🎂";
    if (modalType.value === "cakeOrder") return "Naruči 🎂";
    return "";
  };

  const fetchNextPage = useCallback(() => {
    if (!cakeData?.nextCursor) return;
    setCurrentCursor(cakeData.nextCursor ?? undefined);
  }, [cakeData]);

  const { sentinelRef, isFetchingNext } = useInfiniteScroll({
    nextCursor: cakeData?.nextCursor,
    fetchNextPage,
  });

  if (isLoading && (!sortedCakes || sortedCakes.length === 0)) {
    return (
      <Overlay>
        <Spinner size={350} />
      </Overlay>
    );
  }

  if (isError) {
    return (
      <Overlay>
        <h1 className="text-red-500 text-6xl text-center">
          Papirne torte nisu dostupne trenutno
        </h1>
      </Overlay>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center pb-16">
      {isCakeForm && (
        <Modal
          isModalOpen={isCakeForm}
          closeModal={() => dispatch(closeModal())}
          title={getModalTitle()}
        >
          <Form />
        </Modal>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-min place-items-start">
        {sortedCakes.map((cake) => (
          <Card key={cake.id} cakeData={cake} />
        ))}
      </div>

      {cakeData?.nextCursor && (
        <div ref={sentinelRef} className="h-10 w-full flex justify-center">
          {isFetchingNext && <Spinner size={100} />}
        </div>
      )}
    </main>
  );
};

export default Home;
