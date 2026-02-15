import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Plus, Trash2, TrendingUp, Flame, Droplets, Beef, Wheat, Target, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

const mealSuggestions: Record<string, Omit<Meal, "id" | "time">> = {
  "Oatmeal with berries": { name: "Oatmeal with berries", calories: 280, protein: 8, carbs: 48, fat: 6, type: "breakfast" },
  "Grilled chicken salad": { name: "Grilled chicken salad", calories: 350, protein: 35, carbs: 12, fat: 14, type: "lunch" },
  "Salmon with vegetables": { name: "Salmon with vegetables", calories: 420, protein: 38, carbs: 18, fat: 22, type: "dinner" },
  "Greek yogurt": { name: "Greek yogurt", calories: 150, protein: 15, carbs: 12, fat: 5, type: "snack" },
  "Brown rice & dal": { name: "Brown rice & dal", calories: 380, protein: 14, carbs: 62, fat: 6, type: "lunch" },
  "Egg white omelette": { name: "Egg white omelette", calories: 180, protein: 22, carbs: 4, fat: 8, type: "breakfast" },
  "Fruit smoothie": { name: "Fruit smoothie", calories: 220, protein: 6, carbs: 42, fat: 4, type: "snack" },
  "Grilled paneer tikka": { name: "Grilled paneer tikka", calories: 300, protein: 20, carbs: 8, fat: 22, type: "dinner" },
  "Banana": { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, type: "snack" },
  "Chicken breast (200g)": { name: "Chicken breast (200g)", calories: 330, protein: 62, carbs: 0, fat: 7, type: "lunch" },
};

const aiRecommendations = [
  "Based on your intake, increase protein by adding eggs or legumes at breakfast.",
  "You're low on fiber — add more leafy greens and whole grains.",
  "Great hydration today! Keep drinking water consistently.",
  "Consider reducing refined carbs and adding complex carbs like sweet potato.",
  "Your dinner is heavy on fats — try grilling instead of frying.",
  "Add omega-3 rich foods like walnuts or flaxseeds for heart health.",
];

const DietTracker = () => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem("diet-meals");
    return saved ? JSON.parse(saved) : [];
  });
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem("diet-water");
    return saved ? parseInt(saved) : 0;
  });
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "", type: "breakfast" as Meal["type"] });
  const [goals] = useState<DailyGoals>({ calories: 2000, protein: 60, carbs: 250, fat: 65, water: 8 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("diet-meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("diet-water", waterGlasses.toString());
  }, [waterGlasses]);

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;
    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: newMeal.type,
    };
    setMeals(prev => [...prev, meal]);
    setNewMeal({ name: "", calories: "", protein: "", carbs: "", fat: "", type: "breakfast" });
    setShowAddMeal(false);
    toast({ title: "Meal logged!", description: `${meal.name} — ${meal.calories} kcal` });
  };

  const addSuggestion = (key: string) => {
    const s = mealSuggestions[key];
    const meal: Meal = {
      id: Date.now().toString(),
      ...s,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMeals(prev => [...prev, meal]);
    toast({ title: "Meal logged!", description: `${meal.name} — ${meal.calories} kcal` });
  };

  const removeMeal = (id: string) => setMeals(prev => prev.filter(m => m.id !== id));

  const mealTypeEmoji: Record<string, string> = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Apple className="w-3 h-3 mr-1" /> AI Powered
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Diet & <span className="text-gradient">Nutrition</span> Tracker
            </h1>
            <p className="text-muted-foreground">Log meals, track macros, and get AI-powered dietary recommendations</p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Calories", value: totals.calories, goal: goals.calories, unit: "kcal", icon: Flame, color: "text-orange-500" },
              { label: "Protein", value: totals.protein, goal: goals.protein, unit: "g", icon: Beef, color: "text-red-500" },
              { label: "Carbs", value: totals.carbs, goal: goals.carbs, unit: "g", icon: Wheat, color: "text-amber-500" },
              { label: "Fat", value: totals.fat, goal: goals.fat, unit: "g", icon: TrendingUp, color: "text-blue-500" },
              { label: "Water", value: waterGlasses, goal: goals.water, unit: "glasses", icon: Droplets, color: "text-cyan-500" },
            ].map(({ label, value, goal, unit, icon: Icon, color }) => (
              <Card key={label} className="border-border">
                <CardContent className="p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold">{value}<span className="text-xs text-muted-foreground">/{goal}{unit}</span></p>
                  <Progress value={Math.min((value / goal) * 100, 100)} className="h-1.5 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Water Tracker */}
          <Card className="mb-6 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  <span className="font-semibold">Water Intake</span>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}>−</Button>
                  <Button size="sm" variant="default" onClick={() => { setWaterGlasses(waterGlasses + 1); toast({ title: "💧 Glass of water logged!" }); }}>+</Button>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: goals.water }).map((_, i) => (
                  <div key={i} className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center text-xs transition-colors ${i < waterGlasses ? "bg-cyan-500/20 border-cyan-500 text-cyan-600" : "border-border text-muted-foreground"}`}>
                    💧
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Meals List */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Today's Meals</h2>
                <Button onClick={() => setShowAddMeal(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Meal
                </Button>
              </div>

              {/* Add Meal Form */}
              <AnimatePresence>
                {showAddMeal && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Card className="border-primary/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Log a Meal</h3>
                          <Button size="icon" variant="ghost" onClick={() => setShowAddMeal(false)}><X className="w-4 h-4" /></Button>
                        </div>
                        <Input placeholder="Meal name" value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Calories (kcal)" type="number" value={newMeal.calories} onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })} />
                          <Input placeholder="Protein (g)" type="number" value={newMeal.protein} onChange={e => setNewMeal({ ...newMeal, protein: e.target.value })} />
                          <Input placeholder="Carbs (g)" type="number" value={newMeal.carbs} onChange={e => setNewMeal({ ...newMeal, carbs: e.target.value })} />
                          <Input placeholder="Fat (g)" type="number" value={newMeal.fat} onChange={e => setNewMeal({ ...newMeal, fat: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                          {(["breakfast", "lunch", "dinner", "snack"] as const).map(t => (
                            <Button key={t} size="sm" variant={newMeal.type === t ? "default" : "outline"} onClick={() => setNewMeal({ ...newMeal, type: t })} className="capitalize text-xs">
                              {mealTypeEmoji[t]} {t}
                            </Button>
                          ))}
                        </div>
                        <Button className="w-full" onClick={addMeal}>Log Meal</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Add Suggestions */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Quick Add
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(mealSuggestions).map(key => (
                      <Button key={key} size="sm" variant="outline" className="text-xs h-7" onClick={() => addSuggestion(key)}>
                        <Plus className="w-3 h-3 mr-1" /> {key}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meal entries */}
              {meals.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Apple className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No meals logged yet. Start tracking your nutrition!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {meals.map((meal, i) => (
                    <motion.div key={meal.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-border">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{mealTypeEmoji[meal.type]}</span>
                            <div>
                              <p className="font-medium text-sm">{meal.name}</p>
                              <p className="text-xs text-muted-foreground">{meal.time} • {meal.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right text-xs">
                              <p className="font-bold text-sm">{meal.calories} kcal</p>
                              <p className="text-muted-foreground">P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</p>
                            </div>
                            <Button size="icon" variant="ghost" className="text-destructive h-7 w-7" onClick={() => removeMeal(meal.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="space-y-4">
              <Card className="border-border bg-gradient-to-b from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> AI Dietary Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {aiRecommendations.slice(0, 4).map((rec, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{rec}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Macro Breakdown */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Macro Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {[
                    { label: "Protein", value: totals.protein, goal: goals.protein, color: "bg-red-500" },
                    { label: "Carbs", value: totals.carbs, goal: goals.carbs, color: "bg-amber-500" },
                    { label: "Fat", value: totals.fat, goal: goals.fat, color: "bg-blue-500" },
                  ].map(({ label, value, goal, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{label}</span>
                        <span className="text-muted-foreground">{value}g / {goal}g</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min((value / goal) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DietTracker;
