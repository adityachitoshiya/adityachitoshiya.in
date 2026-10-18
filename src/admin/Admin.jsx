import { useCallback, useEffect, useState } from 'react'
import { defaultContent } from '../content'
import {
  AuthError, addPasskey, authStatus, friendlyAuthError, getToken, listPasskeys, loadContent, login,
  loginWithPasskey, passkeysSupported, removePasskey, saveContent, setToken, upload,
} from './api'
import { emptyOf, isField, sections } from './fields'
import './admin.css'

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()))
  useEffect(() => {
    document.title = 'Admin — Aditya Chitoshiya'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  const logout = useCallback(() => { setToken(null); setAuthed(false) }, [])
  return authed ? <Editor onLogout={logout} /> : <Login onDone={() => setAuthed(true)} />
}

function Login({ onDone }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  // Until we hear otherwise, show the password form; hide it only if the
  // server says password login is off.
  const [status, setStatus] = useState({ passkeys: false, password: true })
  const canPasskey = passkeysSupported() && status.passkeys

  useEffect(() => {
    authStatus().then(setStatus).catch(() => {})
  }, [])

  const run = async (fn) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      onDone()
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    run(() => login(password))
  }

  return (
    <main className="adm adm-login">
      <form onSubmit={submit} className="adm-card">
        <p className="adm-kicker">Portfolio admin</p>
        <h1>Sign in</h1>
        {canPasskey && (
          <button type="button" className="adm-btn adm-btn--primary adm-btn--big" onClick={() => run(loginWithPasskey)} disabled={busy}>
            ☝ Sign in with Touch ID / passkey
          </button>
        )}
        {canPasskey && status.password && <p className="adm-or"><span>or use your password</span></p>}
        {status.password && (
          <>
            <label className="adm-field">
              <span>Password</span>
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus={!canPasskey} required />
            </label>
            <button className={`adm-btn${canPasskey ? '' : ' adm-btn--primary'}`} disabled={busy}>{busy ? 'Checking…' : 'Sign in with password'}</button>
          </>
        )}
        {error && <p className="adm-error" role="alert">{error}</p>}
      </form>
    </main>
  )
}

function Editor({ onLogout }) {
  const [data, setData] = useState(null)
  const [active, setActive] = useState(sections[0].key)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState('')

  const handleError = useCallback((err) => {
    if (err instanceof AuthError) onLogout()
    else setStatus(`⚠ ${err.message}`)
  }, [onLogout])

  useEffect(() => {
    loadContent()
      .then((d) => setData({ ...defaultContent, ...(d || {}) }))
      .catch((err) => { handleError(err); setData(defaultContent) })
  }, [handleError])

  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setDirty(true)
    setStatus('')
  }

  const save = async () => {
    setStatus('Saving…')
    try {
      const res = await saveContent(data)
      setData({ ...defaultContent, ...res.data })
      setDirty(false)
      setStatus(`Saved ✓ ${new Date(res.updatedAt).toLocaleTimeString()}`)
    } catch (err) {
      handleError(err)
    }
  }

  if (!data) return <main className="adm adm-loading">Loading content…</main>
  const section = sections.find((s) => s.key === active) ?? sections[0]

  return (
    <div className="adm">
      <header className="adm-bar">
        <strong>AC® Admin</strong>
        <span className="adm-status" aria-live="polite">{status || (dirty ? 'Unsaved changes' : 'All changes saved')}</span>
        <div className="adm-bar__actions">
          <a className="adm-btn" href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <button className="adm-btn adm-btn--primary" onClick={save} disabled={!dirty}>Save changes</button>
          <button className="adm-btn adm-btn--ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <div className="adm-body">
        <nav className="adm-nav" aria-label="Sections">
          {sections.map((s) => (
            <button key={s.key} className={s.key === active ? 'is-active' : ''} onClick={() => setActive(s.key)}>{s.title}</button>
          ))}
          <button className={active === 'security' ? 'is-active' : ''} onClick={() => setActive('security')}>🔐 Security</button>
        </nav>
        <main className="adm-main">
          <h1>{active === 'security' ? 'Security' : section.title}</h1>
          {active === 'security' ? (
            <Security onError={handleError} />
          ) : section.list ? (
            <ListField field={section.list} value={data[section.key]} onChange={(v) => update(section.key, v)} onError={handleError} />
          ) : (
            <ObjectFields fields={section.fields} value={data[section.key]} onChange={(v) => update(section.key, v)} onError={handleError} />
          )}
        </main>
      </div>
    </div>
  )
}

function ObjectFields({ fields, value = {}, onChange, onError }) {
  return (
    <div className="adm-grid">
      {Object.entries(fields).map(([k, f]) => (
        <Field key={k} field={f} value={value[k]} onChange={(v) => onChange({ ...value, [k]: v })} onError={onError} />
      ))}
    </div>
  )
}

function Field({ field, value, onChange, onError }) {
  if (field.type === 'list') return <ListField field={field} value={value} onChange={onChange} onError={onError} />
  if (field.type === 'image' || field.type === 'video') return <MediaField field={field} value={value} onChange={onChange} onError={onError} />
  const Tag = field.type === 'textarea' ? 'textarea' : 'input'
  return (
    <label className={`adm-field${field.type === 'textarea' ? ' adm-field--wide' : ''}`}>
      <span>{field.label}</span>
      <Tag
        type={field.type === 'url' ? 'url' : 'text'}
        value={value ?? ''}
        rows={field.type === 'textarea' ? 4 : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function MediaField({ field, value, onChange, onError }) {
  const [busy, setBusy] = useState(false)
  const isVideo = field.type === 'video'

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      onChange(await upload(file, field.type))
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-field adm-field--wide adm-media">
      <span>{field.label}</span>
      <div className="adm-media__row">
        <div className="adm-media__preview">
          {value ? (isVideo ? <video src={value} muted playsInline preload="metadata" /> : <img src={value} alt="" />) : <em>None</em>}
        </div>
        <div className="adm-media__controls">
          <input type="url" value={value ?? ''} placeholder="https://… or /img/…" onChange={(e) => onChange(e.target.value)} aria-label={`${field.label} URL`} />
          <label className="adm-btn">
            {busy ? 'Uploading…' : `Upload ${isVideo ? 'video' : 'image'}`}
            <input type="file" accept={isVideo ? 'video/*' : 'image/*'} onChange={pick} disabled={busy} hidden />
          </label>
        </div>
      </div>
    </div>
  )
}

export function ListField({ field, value = [], onChange, onError }) {
  const items = Array.isArray(value) ? value : []
  const simple = isField(field.item)
  const set = (i, v) => onChange(items.map((it, n) => (n === i ? v : it)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const remove = (i) => {
    const label = simple ? items[i] : items[i]?.[field.titleKey]
    if (window.confirm(`Remove "${label || 'this item'}"?`)) onChange(items.filter((_, n) => n !== i))
  }

  return (
    <fieldset className="adm-list adm-field--wide">
      <legend>{field.label} <small>({items.length})</small></legend>
      {items.map((it, i) => (
        <div className={`adm-item${simple ? ' adm-item--simple' : ''}`} key={i}>
          <div className="adm-item__head">
            <span className="adm-item__num">{String(i + 1).padStart(2, '0')}</span>
            {simple ? (
              <input value={it ?? ''} onChange={(e) => set(i, e.target.value)} aria-label={`${field.item.label} ${i + 1}`} />
            ) : (
              <strong>{it?.[field.titleKey] || 'Untitled'}</strong>
            )}
            <div className="adm-item__tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove">✕</button>
            </div>
          </div>
          {!simple && <ObjectFields fields={field.item} value={it} onChange={(v) => set(i, v)} onError={onError} />}
        </div>
      ))}
      <button type="button" className="adm-btn" onClick={() => onChange([...items, emptyOf(field.item)])}>+ Add {simple ? field.item.label.toLowerCase() : 'item'}</button>
    </fieldset>
  )
}

function Security({ onError }) {
  const [info, setInfo] = useState(null)
  const [name, setName] = useState('MacBook')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const supported = passkeysSupported()

  const refresh = useCallback(() => listPasskeys().then(setInfo).catch(onError), [onError])
  useEffect(() => { refresh() }, [refresh])

  const add = async () => {
    setBusy(true)
    setNote('')
    try {
      await addPasskey(name)
      setNote('Passkey added. You can now sign in with Touch ID.')
      await refresh()
    } catch (err) {
      if (err instanceof AuthError) onError(err)
      else setNote(`⚠ ${friendlyAuthError(err)}`)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Remove the passkey "${p.name}"?`)) return
    try {
      await removePasskey(p.id)
      await refresh()
    } catch (err) {
      if (err instanceof AuthError) onError(err)
      else setNote(`⚠ ${friendlyAuthError(err)}`)
    }
  }

  const when = (t) => (t ? new Date(t).toLocaleString() : 'never')

  return (
    <div className="adm-sec">
      <p className="adm-lead">
        Sign in with your fingerprint (Touch ID) instead of typing the password. The fingerprint never leaves your
        Mac; the server only stores a public key.
      </p>

      <fieldset className="adm-list">
        <legend>Your passkeys <small>({info ? info.passkeys.length : '…'})</small></legend>
        {info?.passkeys.length === 0 && <p className="adm-empty">No passkeys yet.</p>}
        {info?.passkeys.map((p) => (
          <div className="adm-item" key={p.id}>
            <div className="adm-item__head">
              <strong>{p.name}</strong>
              <span className="adm-meta">
                {p.backedUp ? 'synced via iCloud Keychain · ' : ''}added {when(p.createdAt)} · last used {when(p.lastUsedAt)}
              </span>
              <div className="adm-item__tools">
                <button type="button" onClick={() => remove(p)} aria-label={`Remove ${p.name}`}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </fieldset>

      {supported ? (
        <div className="adm-add">
          <label className="adm-field">
            <span>Name for this device</span>
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="adm-btn adm-btn--primary" onClick={add} disabled={busy}>{busy ? 'Waiting for Touch ID…' : '☝ Add passkey on this device'}</button>
        </div>
      ) : (
        <p className="adm-error">This browser doesn’t support passkeys.</p>
      )}
      {note && <p className="adm-note" role="status">{note}</p>}

      <p className="adm-lead">
        Password login is {info?.passwordLogin === false ? 'turned off' : 'still on, as a backup'}. To turn it off once
        your passkey works, set <code>DISABLE_PASSWORD_LOGIN=1</code> in your environment.
      </p>
    </div>
  )
}
