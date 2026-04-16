import React, { useEffect, useState } from 'react';
import ProvisioningScreen from './components/ProvisioningScreen.jsx';
import SessionView from './components/SessionView.jsx';
import { VERTICALS } from './data/verticals.js';

function readQueryParams() {
  const p = new URLSearchParams(window.location.search);
  const industry = p.get('industry');
  const state = p.get('state');
  if (!industry || !state || !VERTICALS[industry]) return null;
  return {
    orgName: p.get('org') || VERTICALS[industry].name + ' Demo',
    industry,
    state,
    locationId: p.get('location') || '',
    roles: VERTICALS[industry].roles
  };
}

export default function App() {
  const [provisioning, setProvisioning] = useState(() => readQueryParams());

  useEffect(() => {
    if (!provisioning) return;
    // Update URL for shareable links, but don't create a nav entry each time
    const params = new URLSearchParams({
      org: provisioning.orgName,
      industry: provisioning.industry,
      state: provisioning.state,
      location: provisioning.locationId || ''
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [provisioning]);

  if (!provisioning) {
    return <ProvisioningScreen onLaunch={setProvisioning} />;
  }

  return (
    <SessionView
      provisioning={provisioning}
      onChangeProvisioning={() => {
        window.history.replaceState({}, '', window.location.pathname);
        setProvisioning(null);
      }}
    />
  );
}
