import React, { useState } from 'react';
import { VERTICALS, US_STATES, QUICK_LAUNCH_PROFILES } from '../data/verticals.js';

export default function ProvisioningScreen({ initial, onLaunch }) {
  const [orgName, setOrgName] = useState(initial?.orgName || '');
  const [industry, setIndustry] = useState(initial?.industry || '');
  const [stateVal, setStateVal] = useState(initial?.state || '');
  const [locationId, setLocationId] = useState(initial?.locationId || '');
  const [roles, setRoles] = useState(initial?.roles || []);

  const pickIndustry = (id) => {
    setIndustry(id);
    // auto-populate roles with full default list
    setRoles(VERTICALS[id].roles);
  };

  const toggleRole = (role) => {
    setRoles(rs => rs.includes(role) ? rs.filter(r => r !== role) : [...rs, role]);
  };

  const canLaunch = industry && stateVal;

  const launch = () => {
    if (!canLaunch) return;
    onLaunch({
      orgName: orgName || VERTICALS[industry].name + ' Demo',
      industry,
      state: stateVal,
      locationId,
      roles
    });
  };

  const quickLaunch = (profile) => {
    onLaunch({
      orgName: profile.orgName,
      industry: profile.industry,
      state: profile.state,
      locationId: profile.locationId,
      roles: VERTICALS[profile.industry].roles
    });
  };

  return (
    <main className="prov">
      <header className="prov__header">
        <h1>UpLevyl · Prototype Setup</h1>
        <p className="prov__subtitle">Configure the deployment context for this manager</p>
      </header>

      <section className="prov__section">
        <label className="prov__field">
          <span className="prov__label">Organization Name</span>
          <input
            type="text"
            placeholder="e.g. Walgreens"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
        </label>
      </section>

      <section className="prov__section">
        <span className="prov__label">Industry</span>
        <div className="industry-grid">
          {Object.values(VERTICALS).map(v => (
            <button
              key={v.id}
              type="button"
              className={`industry-card ${industry === v.id ? 'industry-card--selected' : ''}`}
              onClick={() => pickIndustry(v.id)}
            >
              <div className="industry-card__icon">{v.icon}</div>
              <div className="industry-card__name">{v.name}</div>
              <div className="industry-card__desc">{v.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="prov__section prov__row">
        <label className="prov__field">
          <span className="prov__label">State</span>
          <select value={stateVal} onChange={e => setStateVal(e.target.value)}>
            <option value="">Select state…</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="prov__field">
          <span className="prov__label">Location ID / Store #</span>
          <input
            type="text"
            placeholder="e.g. #4821"
            value={locationId}
            onChange={e => setLocationId(e.target.value)}
          />
        </label>
      </section>

      {industry && (
        <section className="prov__section">
          <span className="prov__label">Roles</span>
          <div className="role-grid">
            {VERTICALS[industry].roles.map(role => (
              <label key={role} className="role-check">
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="prov__section">
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={!canLaunch}
          onClick={launch}
        >
          Launch Manager View →
        </button>
        {!canLaunch && (
          <div className="prov__hint">Select an industry and state to continue.</div>
        )}
      </section>

      <hr className="prov__divider" />

      <section className="prov__section">
        <h2 className="prov__h2">Quick Launch</h2>
        <p className="prov__subtitle">Pre-provisioned deployment profiles</p>
        <div className="quick-launch">
          {QUICK_LAUNCH_PROFILES.map(p => {
            const v = VERTICALS[p.industry];
            return (
              <button key={p.id} type="button" className="quick-card" onClick={() => quickLaunch(p)}>
                <div className="quick-card__icon">{v.icon}</div>
                <div className="quick-card__body">
                  <div className="quick-card__title">{p.display}</div>
                  <div className="quick-card__industry">{v.name}</div>
                </div>
                <div className="quick-card__arrow">→</div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
