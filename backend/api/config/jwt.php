<?php
const JWT_SECRET = "hola soy valentin gabriel juarez J7";

// ✅ recomendado: secreto distinto para refresh
const JWT_REFRESH_SECRET = "hola soy valentin gabriel juarez J7 REFRESH";

const JWT_ISSUER = "ej-front-3";

const JWT_TTL_SECONDS = 60 * 15;          // access: 15 min
const JWT_REFRESH_TTL_SECONDS = 60 * 60 * 24 * 14; // refresh: 14 días
