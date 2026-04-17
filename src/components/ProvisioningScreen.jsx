import React, { useRef, useState } from 'react';
import { VERTICALS, US_STATES, QUICK_LAUNCH_PROFILES } from '../data/verticals.js';

export default function ProvisioningScreen({ initial, onLaunch }) {
  const [orgName, setOrgName] = useState(initial?.orgName || '');
  const [industry, setIndustry] = useState(initial?.industry || '');
  const [stateVal, setStateVal] = useState(initial?.state || '');
  const [locationId, setLocationId] = useState(initial?.locationId || '');
  const [roles, setRoles] = useState(initial?.roles || []);
  const [launching, setLaunching] = useState(false);
  const quickLaunchRef = useRef(null);

  const pickIndustry = (id) => {
    setIndustry(id);
    setRoles(VERTICALS[id].roles);
  };

  const toggleRole = (role) => {
    setRoles(rs => rs.includes(role) ? rs.filter(r => r !== role) : [...rs, role]);
  };

  const canLaunch = industry && stateVal;

  const launch = () => {
    if (!canLaunch || launching) return;
    setLaunching(true);
    setTimeout(() => {
      onLaunch({
        orgName: orgName || VERTICALS[industry].name + ' Demo',
        industry,
        state: stateVal,
        locationId,
        roles
      });
      setLaunching(false);
    }, 300);
  };

  const quickLaunch = (profile) => {
    setLaunching(true);
    setTimeout(() => {
      onLaunch({
        orgName: profile.orgName,
        industry: profile.industry,
        state: profile.state,
        locationId: profile.locationId,
        roles: VERTICALS[profile.industry].roles
      });
      setLaunching(false);
    }, 200);
  };

  const scrollToQuickLaunch = () => {
    quickLaunchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="shell__content prov">
      <header className="prov__hero">
        <h1>Prototype Setup</h1>
        <p className="prov__subtitle">
          Configure the deployment context for this manager. Uplevyl returns jurisdiction-specific,
          attorney-supervised compliance guidance in seconds.
        </p>
        <button
          type="button"
          className="prov__try-demo"
          onClick={scrollToQuickLaunch}
        >
          ↓ Try a pre-provisioned demo
        </button>
      </header>

      <section className="prov__section">
        <div className="prov__section-head">
          <div className="section-label">1 · Organization</div>
          <div className="section-desc">Who is this manager working for?</div>
        </div>
        <label className="prov__field">
          <span className="prov__label">Organization name</span>
          <input
            type="text"
            placeholder="e.g. Walgreens"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
        </label>
      </section>

      <section className="prov__section">
        <div className="prov__section-head">
          <div className="section-label">2 · Industry</div>
          <div className="section-desc">Guidance is tailored to industry-specific statutes.</div>
        </div>
        <div className="industry-grid" role="radiogroup" aria-label="Industry">
          {Object.values(VERTICALS).map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={industry === v.id}
              className={`industry-card ${industry === v.id ? 'industry-card--selected' : ''}`}
              onClick={() => pickIndustry(v.id)}
              style={{ animation: `stagger-in 320ms ease-out ${i * 50}ms both` }}
            >
              <div className="industry-card__icon" aria-hidden="true">{v.icon}</div>
              <div className="industry-card__name">{v.name}</div>
              <div className="industry-card__desc">{v.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="prov__section">
        <div className="prov__section-head">
          <div className="section-label">3 · Location</div>
          <div className="section-desc">State drives jurisdiction-specific legal analysis.</div>
        </div>
        <div className="prov__row">
          <label className="prov__field">
            <span className="prov__label">State</span>
            <select value={stateVal} onChange={e => setStateVal(e.target.value)} aria-label="State">
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
        </div>
      </section>

      {industry && (
        <section className="prov__section">
          <div className="prov__section-head">
            <div className="section-label">4 · Roles</div>
            <div className="section-desc">
              Select the roles you manage — guidance will be customized accordingly.
            </div>
          </div>
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
        <div className="launch-row">
          <button
            type="button"
            className={`btn btn--primary btn--large ${launching ? 'btn--loading' : ''}`}
            disabled={!canLaunch || launching}
            onClick={launch}
            aria-label="Launch Manager View"
          >
            Launch Manager View →
          </button>
          {!canLaunch && !launching && (
            <div className="prov__hint">Select an industry and state to continue.</div>
          )}
        </div>
      </section>

      <hr className="prov__divider" ref={quickLaunchRef} />

      <section className="prov__section">
        <div className="quick-launch-head">
          <div>
            <div className="section-label">Quick Launch</div>
            <div className="section-desc">Pre-provisioned deployment profiles for quick demos.</div>
          </div>
        </div>
        <div className="quick-launch">
          {QUICK_LAUNCH_PROFILES.map((p, i) => {
            const v = VERTICALS[p.industry];
            return (
              <button
                key={p.id}
                type="button"
                className="quick-card"
                onClick={() => quickLaunch(p)}
                disabled={launching}
                style={{ animation: `stagger-in 320ms ease-out ${i * 50}ms both` }}
              >
                <div className="quick-card__icon" aria-hidden="true">{v.icon}</div>
                <div className="quick-card__body">
                  <div className="quick-card__title">{p.display}</div>
                  <div className="quick-card__industry">{v.name}</div>
                </div>
                <div className="quick-card__arrow" aria-hidden="true">→</div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
