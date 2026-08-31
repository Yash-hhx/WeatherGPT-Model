CREATE TABLE public.live_alerts (
  id BIGINT PRIMARY KEY,
  disaster_type TEXT NOT NULL,
  category TEXT NOT NULL,
  area_description TEXT NOT NULL,
  warning_message TEXT NOT NULL DEFAULT '',
  severity_color TEXT NOT NULL DEFAULT 'yellow',
  severity_level TEXT,
  severity_raw TEXT,
  alert_source TEXT,
  effective_start TIMESTAMP WITH TIME ZONE,
  effective_end TIMESTAMP WITH TIME ZONE,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  area_covered_km2 DOUBLE PRECISION,
  state TEXT,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  ingested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX live_alerts_category_idx ON public.live_alerts (category);
CREATE INDEX live_alerts_effective_end_idx ON public.live_alerts (effective_end DESC);

GRANT SELECT ON public.live_alerts TO anon;
GRANT SELECT ON public.live_alerts TO authenticated;
GRANT ALL ON public.live_alerts TO service_role;
ALTER TABLE public.live_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Live alerts are public" ON public.live_alerts FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.live_conditions (
  city TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  temperature_c DOUBLE PRECISION,
  apparent_c DOUBLE PRECISION,
  precipitation_mm DOUBLE PRECISION,
  precip_24h_mm DOUBLE PRECISION,
  wind_kph DOUBLE PRECISION,
  us_aqi DOUBLE PRECISION,
  pm2_5 DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.live_conditions TO anon;
GRANT SELECT ON public.live_conditions TO authenticated;
GRANT ALL ON public.live_conditions TO service_role;
ALTER TABLE public.live_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Live conditions are public" ON public.live_conditions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.ingest_runs (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  ok BOOLEAN NOT NULL DEFAULT true,
  records INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  ran_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX ingest_runs_ran_at_idx ON public.ingest_runs (ran_at DESC);

GRANT SELECT ON public.ingest_runs TO anon;
GRANT SELECT ON public.ingest_runs TO authenticated;
GRANT ALL ON public.ingest_runs TO service_role;
ALTER TABLE public.ingest_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ingest runs are public" ON public.ingest_runs FOR SELECT TO anon, authenticated USING (true);