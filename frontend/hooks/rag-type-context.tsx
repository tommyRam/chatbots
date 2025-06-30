"use client";

import { createContext, useContext, useState } from "react";
import { allRagTechnicsConstant } from "@/utils/constants";

interface RagTypeContextType {
    allRagTechnics: RagTypeSchema[];
    currentRagTechnic: RagTypeSchema;
    handleChangeCurrentRagTechnic: (index: number) => void;
}

const RagTechnicsContext = createContext<RagTypeContextType | undefined>(undefined);

export default function RagProvider (
    { children } : { children: React.ReactNode }
) { 
    const [allRagTechnics, setAllRagTechnics] = useState<RagTypeSchema[]>(allRagTechnicsConstant);
    const [currentRagTechnic, setCurrentRagTechnic] = useState<RagTypeSchema>(allRagTechnicsConstant[0]);

    const handleChangeCurrentRagTechnic = (index: number): void => {
        setCurrentRagTechnic(allRagTechnics[index]);
    }

    const value =  {
        allRagTechnics,
        currentRagTechnic,
        handleChangeCurrentRagTechnic
    }

    return (
        <RagTechnicsContext.Provider value={value}>
            {children}
        </RagTechnicsContext.Provider>
    );
}

export function useAllRagTechnics() {
    const context = useContext(RagTechnicsContext);

    if(context == null){
        throw new Error("useAllRagTechnics must be inside the RagProvider");
    }

    return context;
}