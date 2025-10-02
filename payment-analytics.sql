-- Payment failure analytics and monitoring queries
-- This file contains useful queries for monitoring payment failures

-- Query to count failures by failure code (last 24 hours)
CREATE OR REPLACE VIEW payment_failure_stats_24h AS
SELECT 
    last_failure_code,
    COUNT(*) as failure_count,
    COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0) as failure_percentage
FROM orders 
WHERE 
    last_failure_code IS NOT NULL 
    AND updated_at >= NOW() - INTERVAL '24 hours'
GROUP BY last_failure_code
ORDER BY failure_count DESC;

-- Query to count failures by failure code (last 15 minutes for alerts)
CREATE OR REPLACE FUNCTION get_recent_failure_rate()
RETURNS TABLE(
    total_attempts INTEGER,
    failed_attempts INTEGER,
    failure_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_attempts,
        COUNT(CASE WHEN last_failure_code IS NOT NULL THEN 1 END)::INTEGER as failed_attempts,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN last_failure_code IS NOT NULL THEN 1 END) * 100.0 / COUNT(*))::DECIMAL, 2)
            ELSE 0.00
        END as failure_rate
    FROM orders 
    WHERE 
        payment_attempts > 0 
        AND updated_at >= NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- Query for admin dashboard - recent payment issues
CREATE OR REPLACE VIEW recent_payment_issues AS
SELECT 
    id,
    user_email,
    total_price,
    payment_attempts,
    last_failure_code,
    last_failure_message,
    expires_at,
    created_at,
    updated_at,
    CASE 
        WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN 'expired'
        WHEN payment_attempts >= 5 THEN 'max_attempts'
        WHEN status = 'failed' THEN 'failed'
        ELSE 'active'
    END as issue_type
FROM orders 
WHERE 
    (last_failure_code IS NOT NULL OR payment_attempts >= 5 OR (expires_at IS NOT NULL AND expires_at < NOW()))
    AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;

-- Function to check if failure rate exceeds threshold (for alerts)
CREATE OR REPLACE FUNCTION check_failure_rate_alert(threshold_percentage DECIMAL DEFAULT 20.0)
RETURNS TABLE(
    alert_triggered BOOLEAN,
    current_failure_rate DECIMAL(5,2),
    threshold DECIMAL(5,2),
    total_attempts INTEGER,
    failed_attempts INTEGER
) AS $$
DECLARE
    stats RECORD;
BEGIN
    SELECT * INTO stats FROM get_recent_failure_rate();
    
    RETURN QUERY
    SELECT 
        (stats.failure_rate > threshold_percentage) as alert_triggered,
        stats.failure_rate as current_failure_rate,
        threshold_percentage as threshold,
        stats.total_attempts,
        stats.failed_attempts;
END;
$$ LANGUAGE plpgsql;

-- Example usage queries:
-- 
-- -- Get failure stats for last 24 hours
-- SELECT * FROM payment_failure_stats_24h;
-- 
-- -- Get recent failure rate (last 15 minutes)
-- SELECT * FROM get_recent_failure_rate();
-- 
-- -- Check if failure rate alert should be triggered (default 20% threshold)
-- SELECT * FROM check_failure_rate_alert();
-- 
-- -- Check with custom threshold (30%)
-- SELECT * FROM check_failure_rate_alert(30.0);
-- 
-- -- Get recent payment issues for admin review
-- SELECT * FROM recent_payment_issues WHERE issue_type = 'failed' LIMIT 10;
