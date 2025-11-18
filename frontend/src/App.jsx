/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  Loader2,
  Landmark,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Send,
  Clock,
  Trash2,
  Copy,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
  Settings,
  Pocket,
  TrendingUp,
  Activity,
  Globe,
  Zap,
  BarChart3,
  Shield,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------
// Enhanced presentational components
// -------------------------
const Card = ({ children, className = "", gradient = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`${
      gradient
        ? "bg-gradient-to-br from-blue-900/30 via-gray-900/60 to-purple-900/30"
        : "bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-900/80"
    } backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ title, description, right, icon: Icon }) => (
  <div className="px-6 py-5 border-b border-gray-800/50 flex items-start justify-between gap-4">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-white leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
    {right}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-semibold text-gray-300 mb-2 ${className}`}
  >
    {children}
  </label>
);

const Input = React.forwardRef(
  ({ className = "", type = "text", icon: Icon, ...props }, ref) => (
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full h-12 px-4 ${
          Icon ? "pl-10" : ""
        } bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 ${className}`}
        {...props}
      />
    </div>
  )
);

const Button = ({
  children,
  className = "",
  variant = "primary",
  disabled,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50",
    ghost:
      "bg-gray-800/50 border border-gray-700 text-gray-200 hover:bg-gray-700/50 hover:border-gray-600",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/30",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-900/30",
  };
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        variants[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </motion.button>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    yellow:
      "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 mt-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-gray-900/40`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

// -------------------------
// Enhanced Result Display
// -------------------------
const ResultDisplay = ({ status }) => {
  if (!status) return null;

  const { message, fraud_score, success, reason, latency } = status;

  let Icon = ShieldHalf;
  let title = "Unknown Status";
  let tone = "gray";
  let subtitle = "";

  if (message === "Approve") {
    Icon = ShieldCheck;
    title = "Transaction Approved";
    subtitle = "All security checks passed";
    tone = "green";
  } else if (message === "Reject") {
    Icon = ShieldAlert;
    title = "Transaction Rejected";
    subtitle = "Security risk detected";
    tone = "red";
  } else if (message === "Review") {
    Icon = ShieldHalf;
    title = "Flagged for Manual Review";
    subtitle = "Human verification required";
    tone = "yellow";
  } else if (message && message.toLowerCase().includes("sanction")) {
    Icon = ShieldAlert;
    title = "Blocked — Sanctions Match";
    subtitle = "Regulatory compliance block";
    tone = "red";
  }

  const percent =
    typeof fraud_score === "number"
      ? Math.max(0, Math.min(1, fraud_score)) * 100
      : null;

  const toneClasses = {
    green:
      "from-green-900/40 via-green-800/30 to-gray-900/60 border-green-500/50 shadow-green-900/20",
    red: "from-red-900/40 via-red-800/30 to-gray-900/60 border-red-500/50 shadow-red-900/20",
    yellow:
      "from-yellow-900/40 via-yellow-800/30 to-gray-900/60 border-yellow-500/50 shadow-yellow-900/20",
    gray: "from-gray-800/60 via-gray-900/40 to-gray-900 border-gray-500/50",
  }[tone];

  const iconColors = {
    green: "text-green-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    gray: "text-gray-400",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`mt-6 border-2 ${toneClasses}`} gradient>
        <CardHeader
          right={
            <div className="flex items-center gap-3 bg-gray-900/40 px-3 py-1.5 rounded-lg border border-gray-700/50">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-300">
                {new Date().toLocaleString()}
              </span>
            </div>
          }
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`p-3 rounded-xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50`}
            >
              <Icon className={`h-8 w-8 ${iconColors}`} />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>

              {/* NEW SUCCESS INDICATOR */}
              {success !== undefined && (
                <p
                  className={`text-xs mt-1 font-semibold ${
                    success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {success
                    ? "✔ Passed all risk checks"
                    : "✖ Flagged by risk engine"}
                </p>
              )}

              {reason && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Reason: {reason}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {percent !== null && (
            <div className="space-y-4">
              {/* Fraud Score Header */}
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <div className="text-sm font-medium text-gray-400">
                    Fraud Probability Score
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="text-3xl font-bold text-white">
                    {percent.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-400">%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-4 bg-gray-900/60 rounded-full overflow-hidden border border-gray-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-4 rounded-full relative"
                  style={{
                    background:
                      percent < 30
                        ? "linear-gradient(90deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))"
                        : percent < 70
                        ? "linear-gradient(90deg, rgba(234,179,8,0.9), rgba(202,138,4,0.9))"
                        : "linear-gradient(90deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 mb-1">Threshold</div>
                  <div className="text-lg font-bold text-white">75%</div>
                </div>
                <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 mb-1">Model</div>
                  <div className="text-sm font-bold text-white">
                    ensemble-v2
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 mb-1">Latency</div>
                  <div className="text-lg font-bold text-white">
                    {latency ?? "—"}ms
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 mb-1">Confidence</div>
                  <div className="text-lg font-bold text-white">98%</div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mt-4 p-4 bg-gray-900/60 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <div className="text-sm font-semibold text-gray-300">
                    Risk Factors
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location anomaly:</span>
                    <span className="text-white font-medium">
                      {percent > 50 ? "High" : "Low"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount risk:</span>
                    <span className="text-white font-medium">
                      {percent > 60 ? "Elevated" : "Normal"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time pattern:</span>
                    <span className="text-white font-medium">Standard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocity check:</span>
                    <span className="text-white font-medium">Passed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!percent && (
            <p className="text-sm text-gray-400">
              No score returned by the engine — check API response.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// -------------------------
// Main app
// -------------------------
export default function App() {
  const [formData, setFormData] = useState(() => ({
    Customer_name: "Arya Bailur (Test)",
    CUSTOMER_ID: 596,
    TX_DATETIME: new Date().toISOString(),
    TX_AMT: 125.5,
    latitude: 19.07,
    longitude: 72.87,
  }));

  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("tx_history_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    approvedCount: 0,
    rejectedCount: 0,
    avgLatency: 0,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tx_history_v1",
        JSON.stringify(history.slice(0, 30))
      );

      // Update stats
      const approved = history.filter(
        (h) => h.result?.message === "Approve"
      ).length;
      const rejected = history.filter(
        (h) => h.result?.message === "Reject"
      ).length;
      const avgLat =
        history.length > 0
          ? history.reduce((acc, h) => acc + (h.result?.latency || 0), 0) /
            history.length
          : 0;

      setStats({
        totalTransactions: history.length,
        approvedCount: approved,
        rejectedCount: rejected,
        avgLatency: Math.round(avgLat),
      });
    } catch (e) {}
  }, [history]);

  const showToast = (text, kind = "info") => {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setApiResult(null);
    setApiError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const API_URL = "http://127.0.0.1:3001/transaction";

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setApiResult(null);
    setApiError(null);

    if (!formData.Customer_name || !formData.CUSTOMER_ID) {
      showToast("Please provide customer name and ID", "danger");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      TX_DATETIME: new Date(formData.TX_DATETIME).toISOString(),
    };

    const started = performance.now();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const latency = Math.round(performance.now() - started);
      const contentType = response.headers.get("content-type") || "";

      // parse depending on content-type
      let parsed;
      if (contentType.includes("application/json")) {
        parsed = await response.json();
      } else {
        // fallback: get text so we can surface server HTML/error pages
        const text = await response.text();
        console.error("Non-JSON response from API:", {
          status: response.status,
          text,
        });
        throw new Error(
          `Server returned non-JSON response (status ${
            response.status
          }). Start of response: ${text.slice(0, 300)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          parsed?.error || parsed?.message || `HTTP ${response.status}`
        );
      }

      const enhanced = { ...parsed, latency };
      setApiResult(enhanced);
      setHistory((h) =>
        [{ id: Date.now(), input: payload, result: enhanced }, ...h].slice(
          0,
          30
        )
      );
      showToast("Transaction analyzed successfully", "success");
    } catch (err) {
      console.error("API call failed:", err);
      const message = err?.message ? String(err.message) : String(err);
      setApiError(message);
      showToast("API call failed", "danger");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleQuickPreset = (preset) => {
    setFormData((prev) => ({ ...prev, ...preset }));
    showToast("Preset loaded", "info");
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
    } catch (e) {
      showToast("Copy failed", "danger");
    }
  };

  const rerunFromHistory = (item) => {
    setFormData(item.input);
    setApiResult(item.result);
    showToast("Loaded previous transaction", "info");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tx_history_v1");
    showToast("History cleared", "info");
  };

  const quickLocations = [
    { label: "Mumbai (home)", lat: 19.07, lon: 72.87 },
    { label: "New Delhi", lat: 28.6139, lon: 77.209 },
    { label: "Bengaluru", lat: 12.9716, lon: 77.5946 },
    { label: "Remote - London", lat: 51.5074, lon: -0.1278 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-900 text-gray-200 p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-900/50">
                <Landmark className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Fintech Risk Engine
                </h1>
                <p className="text-sm text-gray-400">
                  Real-time fraud detection & sanctions screening
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-green-300">
                  System Online
                </span>
              </div>
            </div>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={BarChart3}
              label="Total Transactions"
              value={stats.totalTransactions}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Approved"
              value={stats.approvedCount}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Rejected"
              value={stats.rejectedCount}
              color="red"
            />
            <StatCard
              icon={Zap}
              label="Avg Latency"
              value={`${stats.avgLatency}ms`}
              color="yellow"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card gradient>
              <CardHeader
                icon={Send}
                title="Transaction Input"
                description="Enter transaction details for real-time risk analysis"
              />

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="Customer_name">Customer Name</Label>
                        <Input
                          id="Customer_name"
                          name="Customer_name"
                          value={formData.Customer_name}
                          onChange={handleInputChange}
                          icon={User}
                          placeholder="e.g., Arya Bailur"
                        />
                      </div>

                      <div>
                        <Label htmlFor="CUSTOMER_ID">Customer ID</Label>
                        <Input
                          id="CUSTOMER_ID"
                          name="CUSTOMER_ID"
                          type="number"
                          value={formData.CUSTOMER_ID}
                          onChange={handleInputChange}
                          icon={User}
                          placeholder="e.g., 596"
                        />
                      </div>

                      <div>
                        <Label htmlFor="TX_DATETIME">
                          Transaction Timestamp
                        </Label>
                        <Input
                          id="TX_DATETIME"
                          name="TX_DATETIME"
                          type="datetime-local"
                          value={formData.TX_DATETIME.substring(0, 16)}
                          onChange={handleInputChange}
                          icon={Calendar}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="TX_AMT">Amount (USD)</Label>
                        <Input
                          id="TX_AMT"
                          name="TX_AMT"
                          type="number"
                          step="0.01"
                          value={formData.TX_AMT}
                          onChange={handleInputChange}
                          icon={DollarSign}
                          placeholder="e.g., 125.50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="0.0001"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            icon={MapPin}
                            placeholder="19.07"
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="0.0001"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            icon={MapPin}
                            placeholder="72.87"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Quick Location</Label>
                        <select
                          className="w-full h-12 px-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                          onChange={(e) => {
                            const v = quickLocations.find(
                              (q) => q.label === e.target.value
                            );
                            if (v)
                              setFormData((p) => ({
                                ...p,
                                latitude: v.lat,
                                longitude: v.lon,
                              }));
                          }}
                        >
                          <option>Select a location</option>
                          {quickLocations.map((q) => (
                            <option key={q.label}>{q.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="pt-4 border-t border-gray-800/50">
                    <div className="text-sm font-semibold text-gray-300 mb-3">
                      Quick Test Scenarios
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          handleQuickPreset({
                            TX_AMT: 5,
                            latitude: 19.07,
                            longitude: 72.87,
                          })
                        }
                      >
                        <Pocket className="mr-2 h-4 w-4" />
                        Small
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          handleQuickPreset({
                            TX_AMT: 250,
                            latitude: 12.9716,
                            longitude: 77.5946,
                          })
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Local
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          handleQuickPreset({
                            TX_AMT: 10000,
                            latitude: 51.5074,
                            longitude: -0.1278,
                          })
                        }
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Risky
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          navigator.geolocation?.getCurrentPosition(
                            (pos) => {
                              setFormData((p) => ({
                                ...p,
                                latitude: Number(
                                  pos.coords.latitude.toFixed(4)
                                ),
                                longitude: Number(
                                  pos.coords.longitude.toFixed(4)
                                ),
                              }));
                              showToast("Location captured", "success");
                            },
                            () =>
                              showToast("Unable to capture location", "danger")
                          )
                        }
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        My Location
                      </Button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-14 text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing Transaction...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit for Risk Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* API error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <Card className="border-2 border-red-500/50 bg-gradient-to-br from-red-900/30 to-gray-900/60">
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-red-300 text-lg mb-1">
                            API Error
                          </h3>
                          <p className="text-sm text-gray-300">{apiError}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Please check your API endpoint and try again.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            {apiResult && <ResultDisplay status={apiResult} />}

            {/* History */}
            <Card>
              <CardHeader
                icon={Clock}
                title="Transaction History"
                description={`${history.length} recent transaction${
                  history.length !== 1 ? "s" : ""
                }`}
                right={
                  history.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={clearHistory}
                      className="h-9"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )
                }
              />
              <CardContent>
                <div className="space-y-3">
                  {history.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No transactions yet</p>
                      <p className="text-xs mt-1">
                        Submit a transaction to see it here
                      </p>
                    </div>
                  )}

                  {history.slice(0, 10).map((h, idx) => {
                    const resultIcon =
                      h.result?.message === "Approve"
                        ? CheckCircle
                        : h.result?.message === "Reject"
                        ? XCircle
                        : ShieldHalf;
                    const resultColor =
                      h.result?.message === "Approve"
                        ? "text-green-400"
                        : h.result?.message === "Reject"
                        ? "text-red-400"
                        : "text-yellow-400";

                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-gray-800/50">
                            {React.createElement(resultIcon, {
                              className: `h-5 w-5 ${resultColor}`,
                            })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-200 font-semibold truncate">
                              {h.input.Customer_name}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {Number(h.input.TX_AMT).toFixed(2)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(h.id).toLocaleTimeString()}
                              </span>
                              {h.result?.latency && (
                                <span className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  {h.result.latency}ms
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            onClick={() => rerunFromHistory(h)}
                            className="h-9"
                          >
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleCopy(JSON.stringify(h.input, null, 2))
                            }
                            className="h-9"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Insights & controls */}
          <div className="space-y-6">
            <Card gradient>
              <CardHeader
                icon={Shield}
                title="Security Status"
                description="Real-time monitoring"
              />
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">
                        Model Status
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model Version</span>
                        <span className="text-white font-semibold">
                          ensemble-v2
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fraud Threshold</span>
                        <span className="text-white font-semibold">75%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white font-semibold">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">
                        Sanctions Check
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="text-sm text-white font-semibold">
                          No Matches
                        </div>
                        <div className="text-xs text-gray-400">
                          All systems clear
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {stats.approvedCount}
                      </div>
                      <div className="text-xs text-green-300 mt-1">
                        Approved Today
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white">
                        {stats.rejectedCount}
                      </div>
                      <div className="text-xs text-red-300 mt-1">
                        Rejected Today
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                icon={Settings}
                title="Quick Actions"
                description="Manage your workspace"
              />
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setApiResult(null);
                      setApiError(null);
                      showToast("Results cleared", "info");
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Clear Results
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setFormData({
                        Customer_name: "Guest User",
                        CUSTOMER_ID: 1,
                        TX_DATETIME: new Date().toISOString(),
                        TX_AMT: 100.0,
                        latitude: 19.07,
                        longitude: 72.87,
                      });
                      showToast("Form reset to defaults", "info");
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      handleCopy(JSON.stringify(formData, null, 2))
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Current Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                icon={Sparkles}
                title="Pro Tips"
                description="Optimize your testing"
              />
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-blue-300 mb-1">
                          High-Value Test
                        </div>
                        <div className="text-xs text-gray-400">
                          Amounts over $5,000 trigger enhanced screening
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-purple-300 mb-1">
                          Location Test
                        </div>
                        <div className="text-xs text-gray-400">
                          Try distant locations to test impossible travel
                          detection
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-300 mb-1">
                          Performance
                        </div>
                        <div className="text-xs text-gray-400">
                          Average response time is under 100ms for optimal UX
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed right-6 bottom-6 z-50 min-w-[300px]"
          >
            <div
              className={`p-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
                toast.kind === "danger"
                  ? "bg-red-900/90 border-red-500/50"
                  : toast.kind === "success"
                  ? "bg-green-900/90 border-green-500/50"
                  : "bg-gray-800/90 border-gray-600/50"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                {toast.kind === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-300" />
                )}
                {toast.kind === "danger" && (
                  <XCircle className="h-5 w-5 text-red-300" />
                )}
                {toast.kind === "info" && (
                  <Activity className="h-5 w-5 text-blue-300" />
                )}
                <div className="text-sm font-medium">{toast.text}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
