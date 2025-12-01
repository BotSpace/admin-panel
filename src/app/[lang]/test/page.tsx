"use client";

import { useReactQueryAction } from "@/shared/services/react-query";
import React, { useEffect } from "react";

type Props = {};

function Page({}: Props) {
  const { data } = useReactQueryAction({
    url: "/used/40",
  });

  useEffect(() => {
    console.log("🚀 ~ file: page.tsx:16 ~ data:", data);
  }, [data]);
  return <div>Page</div>;
}

export default Page;
