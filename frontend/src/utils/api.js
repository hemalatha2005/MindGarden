/**
 * utils/api.js — Axios HTTP Client for MindGarden
 *
 * All communication with the Express backend goes through this file.
 * Using a centralized API module means if the backend URL changes,
 * you only update it in one place.
 */

import axios from "axios";

// Base URL for all API calls — the Vite proxy forwards /api/* to localhost:5000
const API_BASE = "/api/entries";

/**
 * createEntry(text)
 * Sends the raw user text to the backend for parsing and storage.
 *
 * @param {string} text - raw user input (typed or spoken)
 * @returns {Promise<Object>} - the saved entry document from MongoDB
 */
export const createEntry = async (text) => {
  const response = await axios.post(API_BASE, { text });
  return response.data;
};

/**
 * fetchEntries(filters)
 * Retrieves all entries, with optional query filters.
 *
 * @param {Object} filters - e.g., { type: "task" } or { completed: false }
 * @returns {Promise<Array>} - array of entry documents
 */
export const fetchEntries = async (filters = {}) => {
  const response = await axios.get(API_BASE, { params: filters });
  return response.data;
};

/**
 * updateEntry(id, updates)
 * Partially updates an entry — e.g., mark as completed.
 *
 * @param {string} id - MongoDB _id of the entry
 * @param {Object} updates - fields to change (e.g., { completed: true })
 * @returns {Promise<Object>} - the updated entry document
 */
export const updateEntry = async (id, updates) => {
  const response = await axios.patch(`${API_BASE}/${id}`, updates);
  return response.data;
};

/**
 * deleteEntry(id)
 * Permanently removes an entry.
 *
 * @param {string} id - MongoDB _id of the entry
 * @returns {Promise<Object>} - success message
 */
export const deleteEntry = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};
