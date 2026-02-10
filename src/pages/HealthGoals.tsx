import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, TrendingUp, Award, Flame, Droplets, Moon, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface HealthGoal {
  id: string;
  title: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  history: { date: string; value: number }[];
}

const goalCategories = [
  { value: "steps", label: "Daily Steps", icon: Footprints, unit: "steps", defaultTarget: 10000 },
  { value: "water", label: "Water Intake", icon: Droplets, unit: "glasses", defaultTarget: 8 },
  { value: "sleep", label: "Sleep Hours", icon: Moon, unit: "hours", defaultTarget: 8 },
  { value: "calories", label: "Calories Burned", icon: Flame, unit: "kcal", defaultTarget: 500 },
  { value: "weight", label: "Weight Loss", icon: TrendingUp, unit: "kg", defaultTarget: 5 },
  { value: "custom", label: "Custom Goal", icon: Target, unit: "", defaultTarget: 0 },
];

const HealthGoals = () => {
  const [goals, setGoals] = useState<HealthGoal[]>(() => {
    const saved = localStorage.getItem("healthGoals");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ category: "", title: "", target: "", unit: "", deadline: "" });

  useEffect(() => {
    localStorage.setItem("healthGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.category || !newGoal.target) {
      toast({ title: "Missing fields", description: "Please fill category and target.", variant: "destructive" });
      return;
    }
    const cat = goalCategories.find(c => c.value === newGoal.category);
    const goal: HealthGoal = {
      id: Date.now().toString(),
      title: newGoal.title || cat?.label || "Goal",
      category: newGoal.category,
      target: Number(newGoal.target),
      current: 0,
      unit: newGoal.unit || cat?.unit || "",
      deadline: newGoal.deadline,
      history: generateMockHistory(),
    };
    setGoals(prev => [...prev, goal]);
    setShowForm(false);
    setNewGoal({ category: "", title: "", target: "", unit: "", deadline: "" });
    toast({ title: "Goal Added! 🎯", description: `"${goal.title}" has been added to your goals.` });
  };

  const generateMockHistory = () => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: Math.floor(Math.random() * 80 + 20) };
    });
  };

  const updateProgress = (id: string, value: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newCurrent = Math.min(g.target, Math.max(0, g.current + value));
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const history = [...g.history];
      const lastEntry = history[history.length - 1];
      if (lastEntry?.date === today) {
        lastEntry.value = Math.round((newCurrent / g.target) * 100);
      } else {
        history.push({ date: today, value: Math.round((newCurrent / g.target) * 100) });
      }
      return { ...g, current: newCurrent, history };
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    toast({ title: "Goal removed" });
  };

  const totalProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length) : 0;
  const completedGoals = goals.filter(g => g.current >= g.target).length;

  const weeklyData = [
    { day: "Mon", progress: 65 }, { day: "Tue", progress: 72 }, { day: "Wed", progress: 58 },
    { day: "Thu", progress: 80 }, { day: "Fri", progress: 90 }, { day: "Sat", progress: 45 }, { day: "Sun", progress: 70 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🎯 Health Goals</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track Your <span className="text-gradient">Wellness Goals</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Set fitness and wellness objectives, monitor daily progress with charts.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Goals", value: goals.length, icon: Target },
              { label: "Completed", value: completedGoals, icon: Award },
              { label: "Avg Progress", value: `${totalProgress}%`, icon: TrendingUp },
              { label: "Streak", value: "7 days", icon: Flame },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Weekly Overview Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Weekly Progress Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Add Goal Button */}
          <div className="flex justify-end mb-6">
            <Button variant="hero" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" /> Add New Goal
            </Button>
          </div>

          {/* Add Goal Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">Create New Goal</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Select onValueChange={v => {
                  const cat = goalCategories.find(c => c.value === v);
                  setNewGoal(p => ({ ...p, category: v, unit: cat?.unit || "", target: cat?.defaultTarget?.toString() || "" }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {goalCategories.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Goal title (optional)" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} />
                <Input type="number" placeholder="Target" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} />
                <Input placeholder="Unit" value={newGoal.unit} onChange={e => setNewGoal(p => ({ ...p, unit: e.target.value }))} />
                <Input type="date" value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))} />
                <Button onClick={addGoal} className="h-10">Create Goal</Button>
              </div>
            </motion.div>
          )}

          {/* Goals List */}
          {goals.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No goals yet. Click "Add New Goal" to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {goals.map((goal, index) => {
                const percent = Math.round((goal.current / goal.target) * 100);
                const CatIcon = goalCategories.find(c => c.value === goal.category)?.icon || Target;
                return (
                  <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10"><CatIcon className="w-5 h-5 text-primary" /></div>
                        <div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.current} / {goal.target} {goal.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={percent >= 100 ? "default" : "secondary"}>{percent}%</Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <Progress value={percent} className="h-3 mb-4" />
                    <div className="flex gap-2 mb-4">
                      {[1, 5, 10].map(inc => (
                        <Button key={inc} variant="outline" size="sm" onClick={() => updateProgress(goal.id, inc)}>+{inc}</Button>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => updateProgress(goal.id, -1)}>-1</Button>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={goal.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthGoals;
