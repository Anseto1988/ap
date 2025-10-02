'use strict';

const { Client, Users, Query } = require('node-appwrite');

/**
 * Appwrite Function: Admin List Users
 * Runtime: Node 16
 * Expects JSON payload: { "offset": number, "limit": number }
 * Returns: { users: [], total: number }
 */
module.exports = async function (req, res) {
  const logger = req.log || console;

  try {
    const payload = (req.payload && req.payload.trim()) ? JSON.parse(req.payload) : {};
    const offset = Number.isFinite(payload.offset) ? payload.offset : 0;
    const limit = Number.isFinite(payload.limit) ? payload.limit : 25;

    const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
    if (!apiKey) {
      throw new Error('APPWRITE_FUNCTION_API_KEY is not verfügbar. Setze das Secret in den Function-Umgebungsvariablen.');
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID)
      .setKey(apiKey);

    const users = new Users(client);
    const queries = [Query.offset(offset), Query.limit(limit)];
    const result = await users.list(queries);

    res.json({
      users: result.users ?? [],
      total: result.total ?? result.users?.length ?? 0
    });
  } catch (err) {
    logger.error('Failed to list users', err);
    const message = err?.message || 'Unbekannter Fehler beim Laden der Benutzer';
    res.status(500).json({
      error: message
    });
  }
};
