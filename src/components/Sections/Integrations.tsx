// React
import React from "react";
// Constants
import { integrations } from "@/constants/Constants";
// Types
import { integrationType } from "@/types/Types";
// Components
import IntegrationCard from "../Cards/IntegrationCard";

export default function Integrations() {
  return (
    <div className="h-fit grid grid-cols-2 xl:grid-cols-3 mt-[82px] gap-x-[40px]">
      {integrations.map((integration: integrationType) => {
        return (
          <IntegrationCard
            protocolImage={integration.protocolImage}
            title={integration.title}
            description={integration.description}
            networks={integration.networks}
            status={integration.status}
            key={integration.title}
          />
        );
      })}
    </div>
  );
}
