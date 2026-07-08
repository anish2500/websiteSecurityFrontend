"use client";
import { useMemo } from "react";
import { ZxcvbnFactory, type ZxcvbnResult } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";


const zxcvbn = new ZxcvbnFactory({
    dictionary: { ...zxcvbnCommonPackage.dictionary, ...zxcvbnEnPackage.dictionary},
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
});

const LABELS = [ "Very weak", "Weak", "Fair", "Strong", "Very Strong"];


export function PasswordStrengthMeter({ password}: { password: string}){
    const result = useMemo<ZxcvbnResult | null>(() => (password ? zxcvbn.check(password): null), [password]);
    if (!password) return null; 
    const score = result?.score ?? 0; 

     return (
        <div className="mt-1">
            <div className="h-1.5 w-full rounded bg-gray-200 overflow-hidden">
                <div
                    className="h-full transition-all"
                    style={{
                        width: `${(score + 1) * 20}%`,
                        backgroundColor: ["#dc2626", "#ea580c", "#ca8a04", "#65a30d", "#16a34a"][score],
                    }}
                />
            </div>
            <p className="text-xs mt-1 text-gray-600">{LABELS[score]}</p>
        </div>
    );
}