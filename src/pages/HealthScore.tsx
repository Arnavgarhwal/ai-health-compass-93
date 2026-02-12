import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Droplets, Scale, Target, Pill, TrendingUp, ArrowLeft, Award, Zap, Moon, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";

interface VitalRecord {
  type: string; value: number; value2?: number; date: string;
}
interface GoalRecord {
  id: string; type: string; target: number; current: number; unit: string;
}
interface Reminder {
  active: boolean; times: string[]; takenToday: string[];
}

const HealthScore = () => {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    const v = localStorage.getItem("healthai-vitals");
    const g = localStorage.getItem("healthai-goals");
    const r = localStorage.getItem("wellsync-medicine-reminders");
    const b = localStorage.getItem("healthai-bmi");
    if (v) setVitals(JSON.parse(v));
    if (g) setGoals(JSON.parse(g));
    if (r) setReminders(JSON.parse(r));
    if (b) setBmi(JSON.parse(b));
  }, []);

  const scores = useMemo(() => {
    // Vitals score (0-100)
    let vitalsScore = 50;
    const recentVitals = vitals.filter(v => {
      const d = new Date(v.date);
      const week = new Date(); week.setDate(week.getDate() - 7);
      return d >= week;
    });
    if (recentVitals.length > 0) {
      let good = 0;
      recentVitals.forEach(v => {
        if (v.type === "heart_rate" && v.value >= 60 && v.value <= 100) good++;
        else if (v.type === "blood_pressure" && v.value >= 90 && v.value <= 140) good++;
        else if (v.type === "blood_sugar" && v.value >= 70 && v.value <= 140) good++;
        else if (v.type === "oxygen" && v.value >= 95) good++;
        else if (v.type === "weight") good += 0.5;
      });
      vitalsScore = Math.min(100, Math.round((good / Math.max(recentVitals.length, 1)) * 100));
    }

    // Goals score
    let goalsScore = 50;
    if (goals.length > 0) {
      const avg = goals.reduce((sum, g) => sum + Math.min(100, (g.current / g.target) * 100), 0) / goals.length;
      goalsScore = Math.round(avg);
    }

    // BMI score
    let bmiScore = 50;
    if (bmi) {
      if (bmi >= 18.5 && bmi <= 24.9) bmiScore = 100;
      else if (bmi >= 25 && bmi <= 29.9) bmiScore = 70;
      else if (bmi >= 17 && bmi < 18.5) bmiScore = 60;
      else bmiScore = 40;
    }

    // Medication adherence
    let medScore = 50;
    const today = new Date().toISOString().split("T")[0];
    let total = 0, taken = 0;
    reminders.forEach(r => {
      if (r.active) {
        r.times.forEach(time => {
          total++;
          if (r.takenToday?.includes(`${today}-${time}`)) taken++;
        });
      }
    });
    if (total > 0) medScore = Math.round((taken / total) * 100);

    // Activity score (based on steps goal)
    let activityScore = 50;
    const stepsGoal = goals.find(g => g.type === "steps");
    if (stepsGoal) activityScore = Math.min(100, Math.round((stepsGoal.current / stepsGoal.target) * 100));

    const overall = Math.round(vitalsScore * 0.25 + goalsScore * 0.2 + bmiScore * 0.2 + medScore * 0.2 + activityScore * 0.15);

    return { vitalsScore, goalsScore, bmiScore, medScore, activityScore, overall };
  }, [vitals, goals, bmi, reminders]);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-500", label: "Excellent" };
    if (score >= 80) return { grade: "A", color: "text-green-500", label: "Very Good" };
    if (score >= 70) return { grade: "B", color: "text-blue-500", label: "Good" };
    if (score >= 60) return { grade: "C", color: "text-yellow-500", label: "Fair" };
    return { grade: "D", color: "text-destructive", label: "Needs Improvement" };
  };

  const grade = getGrade(scores.overall);

  const radarData = [
    { category: "Vitals", score: scores.vitalsScore },
    { category: "Goals", score: scores.goalsScore },
    { category: "BMI", score: scores.bmiScore },
    { category: "Medication", score: scores.medScore },
    { category: "Activity", score: scores.activityScore },
  ];

  const radialData = [{ name: "Score", value: scores.overall, fill: "hsl(var(--primary))" }];

  const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      score: Math.max(30, Math.min(100, scores.overall + Math.floor(Math.random() * 20 - 10))),
    };
  });

  const breakdownItems = [
    { label: "Vitals Health", score: scores.vitalsScore, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Goal Progress", score: scores.goalsScore, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "BMI Status", score: scores.bmiScore, icon: Scale, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Med Adherence", score: scores.medScore, icon: Pill, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Activity Level", score: scores.activityScore, icon: Footprints, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="text-3xl font-bold">Health <span className="text-gradient">Score</span></h1>
              <p className="text-muted-foreground">Your comprehensive wellness overview</p>
            </div>
          </div>

          {/* Main Score Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                          <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${grade.color}`}>{scores.overall}</span>
                        <span className="text-sm text-muted-foreground">out of 100</span>
                      </div>
                    </div>
                    <Badge className="mt-2 text-lg px-4 py-1" variant={scores.overall >= 70 ? "default" : "destructive"}>
                      <Award className="w-4 h-4 mr-1" /> Grade: {grade.grade}
                    </Badge>
                    <p className="text-muted-foreground mt-1">{grade.label}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Score Breakdown</h3>
                    <div className="space-y-4">
                      {breakdownItems.map(item => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className="text-sm font-bold">{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Health Radar</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="category" className="text-xs" />
                        <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Weekly Trend</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tips */}
          <Card>
            <CardHeader><CardTitle>💡 Improvement Tips</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {scores.vitalsScore < 70 && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Track Vitals More</h4>
                    <p className="text-sm text-muted-foreground mt-1">Record your vitals daily to improve your health score.</p>
                  </div>
                )}
                {scores.goalsScore < 70 && (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" /> Reach Your Goals</h4>
                    <p className="text-sm text-muted-foreground mt-1">Stay consistent with your health goals for a better score.</p>
                  </div>
                )}
                {scores.medScore < 70 && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-green-500" /> Improve Adherence</h4>
                    <p className="text-sm text-muted-foreground mt-1">Take your medications on time every day.</p>
                  </div>
                )}
                {scores.bmiScore < 70 && (
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Scale className="w-4 h-4 text-purple-500" /> Manage Weight</h4>
                    <p className="text-sm text-muted-foreground mt-1">Aim for a BMI between 18.5 and 24.9.</p>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-accent border border-border">
                  <h4 className="font-semibold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Stay Active</h4>
                  <p className="text-sm text-muted-foreground mt-1">Regular physical activity boosts all aspects of your health score.</p>
                </div>
                <div className="p-4 rounded-xl bg-accent border border-border">
                  <h4 className="font-semibold text-sm flex items-center gap-2"><Moon className="w-4 h-4 text-primary" /> Sleep Well</h4>
                  <p className="text-sm text-muted-foreground mt-1">Aim for 7-9 hours of quality sleep each night.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthScore;
