import React, { useEffect, useState } from 'react';
import ProvisioningScreen from './components/ProvisioningScreen.jsx';
import SessionView from './components/SessionView.jsx';
import BrandHeader from './components/BrandHeader.jsx';
import AppFooter from './components/AppFooter.jsx';
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
    const params = new URLSearchParams({
      org: provisioning.orgName,
      industry: provisioning.industry,
      state: provisioning.state,
      location: provisioning.locationId || ''
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [provisioning]);

  const handleHome = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setProvisioning(null);
  };

  return (
    <div className="shell">
      <BrandHeader
        onHome={handleHome}
        pageLabel={provisioning ? 'Manager Response' : 'Prototype Setup'}
        pageLabelActive={!!provisioning}
      />
      {!provisioning ? (
        <ProvisioningScreen onLaunch={setProvisioning} />
      ) : (
        <SessionView
          provisioning={provisioning}
          onChangeProvisioning={handleHome}
        />
      )}
      <AppFooter />
    </div>
  );
}
