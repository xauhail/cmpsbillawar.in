-- =========================================================================
-- Cloudflare D1 Database Schema for Cambridge Montessori Preschool Billawar
-- Run this in Cloudflare Dashboard > Workers & Pages > D1 > Console
-- =========================================================================

-- 1. Table for Admission Enquiries & Leads
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  parent_name TEXT NOT NULL,
  child_name TEXT,
  phone TEXT NOT NULL,
  program TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'enrolled', 'trash'
  created_at TEXT NOT NULL
);

-- 2. Table for Dynamic School Gallery Photos
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'classrooms', 'activities', 'library', 'play', 'events'
  tag TEXT,
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_gallery_cat ON gallery(category);
