"use client";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  sku: string;
}

export default function ProductQRCode({ sku }: Props) {
    return (
        <div className="flex flex-col items-center gap-2">
            <QRCodeCanvas value={sku} size={180} includeMargin />
            <p className="text-sm text-gray-500">SKU: {sku}</p>
        </div>
    );
}