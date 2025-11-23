# 🔗 Cómo Obtener WalletConnect Project ID

## ⚠️ Advertencia Actual

Si ves estos errores en la consola:
```
GET https://api.web3modal.org/appkit/v1/config?projectId=... 403 (Forbidden)
Origin http://localhost:5175 not found on Allowlist
```

**No te preocupes!** La aplicación sigue funcionando. Estos son warnings de WalletConnect que no afectan la funcionalidad principal.

---

## 🚀 Solución (Opcional - Para Producción)

### **Paso 1: Crear Cuenta en WalletConnect**

1. Ve a: https://cloud.walletconnect.com/sign-in
2. Haz clic en **"Sign Up"**
3. Crea una cuenta con tu email

### **Paso 2: Crear Proyecto**

1. Una vez dentro, haz clic en **"Create Project"**
2. Nombre del proyecto: `HappyHODLers`
3. Tipo: **Web3Modal**
4. Haz clic en **"Create"**

### **Paso 3: Obtener Project ID**

1. En el dashboard, verás tu **Project ID** (formato: `a1b2c3d4e5f6...`)
2. Cópialo

### **Paso 4: Configurar Allowlist**

1. En el proyecto, ve a **"Settings"** → **"Allowlist"**
2. Agrega estos origins:
   ```
   http://localhost:5173
   http://localhost:5174
   http://localhost:5175
   https://tu-dominio.com (cuando despliegues)
   ```
3. Guarda cambios

### **Paso 5: Actualizar Código**

Edita `src/config/wagmi.js`:

```javascript
export const config = getDefaultConfig({
  appName: 'HappyHODLers - Transactional Chatbot',
  projectId: 'TU_PROJECT_ID_AQUI', // 👈 Pega tu Project ID
  chains: [scrollSepolia],
  ssr: false,
});
```

### **Paso 6: Reiniciar Servidor**

```bash
# Detener servidor (Ctrl+C)
npm run dev
```

---

## 🎯 Alternativa: Usar Variables de Entorno

### **Paso 1: Crear archivo `.env`**

En la raíz del proyecto:

```bash
cp .env.example .env
```

### **Paso 2: Editar `.env`**

```env
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id_real
VITE_BACKEND_URL=https://clary-backend-ai.onrender.com
VITE_PYTH_HERMES_URL=https://hermes.pyth.network
```

### **Paso 3: Actualizar `wagmi.js`**

```javascript
export const config = getDefaultConfig({
  appName: 'HappyHODLers - Transactional Chatbot',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3c2b1e8f9d7a6c5b4e3f2a1d0c9b8a7f',
  chains: [scrollSepolia],
  ssr: false,
});
```

---

## ✅ Verificación

Después de configurar, deberías ver en la consola:

```
✅ WalletConnect initialized successfully
✅ No more 403 errors
```

---

## 🆘 Troubleshooting

### **Error: "Origin not found on Allowlist"**

**Solución:**
- Ve a WalletConnect dashboard
- Settings → Allowlist
- Agrega `http://localhost:5175` (o el puerto que estés usando)

### **Error: "Invalid Project ID"**

**Solución:**
- Verifica que copiaste el Project ID completo
- No incluyas espacios ni comillas
- Debe tener formato: `a1b2c3d4e5f6...`

### **Error: "Failed to fetch remote configuration"**

**Solución:**
- Verifica tu conexión a internet
- Espera unos minutos (puede ser rate limiting)
- Usa el fallback local (ya configurado)

---

## 💡 Notas Importantes

1. **No es obligatorio para desarrollo local**
   - La app funciona sin Project ID válido
   - Solo verás warnings en consola
   - Las wallets se conectan igual

2. **Necesario para producción**
   - Mejor experiencia de usuario
   - Analytics de WalletConnect
   - Sin warnings en consola

3. **Gratis hasta 1M requests/mes**
   - Plan gratuito es suficiente para hackathons
   - Sin tarjeta de crédito requerida

---

## 📊 Features de WalletConnect Pro (Opcional)

Si quieres analytics avanzados:

- **User sessions**: Track cuántos usuarios conectan wallets
- **Popular wallets**: Qué wallets usa tu comunidad
- **Geographic data**: De dónde son tus usuarios
- **Performance metrics**: Tiempos de conexión

---

## 🎉 Conclusión

**Para hackathon/desarrollo:** No necesitas Project ID válido (warnings no críticos)

**Para producción:** Obtén Project ID gratis en 5 minutos

---

**Links útiles:**
- WalletConnect Dashboard: https://cloud.walletconnect.com
- Docs: https://docs.walletconnect.com
- Support: https://discord.com/invite/walletconnect
