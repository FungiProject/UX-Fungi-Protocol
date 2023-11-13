import { integrations } from "@/constants/Constants";
import { integrationType } from "@/types/Types";
import React from "react";
import IntegrationCard from "../Cards/IntegrationCard";

export default function Integrations() {
  return (
    <div className="h-fit grid grid-cols-3 mt-[82px]">
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
