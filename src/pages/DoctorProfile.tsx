import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Globe, GraduationCap, ArrowLeft, Video, MessageSquare, Calendar, MapPin, Award, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doctors } from "@/data/mockData";

const mockReviews = [
  { id: 1, name: "Rahul M.", rating: 5, date: "2 days ago", comment: "Excellent doctor! Very thorough and caring. Explained everything clearly.", helpful: 12 },
  { id: 2, name: "Priya S.", rating: 5, date: "1 week ago", comment: "Very professional and knowledgeable. The video consultation was seamless.", helpful: 8 },
  { id: 3, name: "Amit K.", rating: 4, date: "2 weeks ago", comment: "Good experience overall. Wait time was a bit long but consultation was great.", helpful: 5 },
  { id: 4, name: "Sneha R.", rating: 5, date: "3 weeks ago", comment: "Highly recommended! Diagnosed my condition accurately and prescribed effective treatment.", helpful: 15 },
  { id: 5, name: "Vikram P.", rating: 4, date: "1 month ago", comment: "Knowledgeable and patient. Answered all my questions thoroughly.", helpful: 3 },
];

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === Number(id));

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
          <Link to="/consultations"><Button>Back to Consultations</Button></Link>
        </div>
      </div>
    );
  }

  const ratingBreakdown = [
    { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 6 }, { stars: 2, pct: 3 }, { stars: 1, pct: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/consultations">
            <Button variant="ghost" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          </Link>

          {/* Doctor Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="text-8xl text-center md:text-left">{doctor.image}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{doctor.name}</h1>
                      <Badge className="bg-green-500/10 text-green-600 border-green-300">✓ Verified</Badge>
                    </div>
                    <Badge variant="secondary" className="mb-3">{doctor.specialty}</Badge>
                    <p className="text-muted-foreground mb-4">{doctor.about}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" /> {doctor.experience} yrs exp
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" /> {doctor.education}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" /> {doctor.languages.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="text-center p-4 bg-accent rounded-xl">
                      <p className="text-sm text-muted-foreground">Consultation Fee</p>
                      <p className="text-3xl font-bold text-primary">₹{doctor.consultationFee * 83}</p>
                    </div>
                    <Button variant="hero" size="lg" onClick={() => navigate("/consultations")}>
                      <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/video-consultation")}>
                      <Video className="w-4 h-4 mr-2" /> Video Consult
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({doctor.reviews})</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5" /> Specializations</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[doctor.specialty, "General Consultation", "Preventive Care", "Chronic Disease Management", "Emergency Care"].map(s => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Practice Info</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /> Apollo Hospital, Delhi</div>
                    <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-muted-foreground" /> Mon-Sat, 9:00 AM - 6:00 PM</div>
                    <div className="flex items-center gap-2 text-sm"><Video className="w-4 h-4 text-muted-foreground" /> Video & In-person available</div>
                    <div className="flex items-center gap-2 text-sm"><MessageSquare className="w-4 h-4 text-muted-foreground" /> Chat consultation available</div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>About {doctor.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {doctor.about} With {doctor.experience} years of experience, they have treated thousands of patients
                      and are known for their compassionate approach to healthcare. They graduated from {doctor.education} and
                      continue to stay updated with the latest medical advancements in {doctor.specialty.toLowerCase()}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader><CardTitle>Rating Summary</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-bold">{doctor.rating}</span>
                      <div className="flex justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.round(doctor.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{doctor.reviews} reviews</p>
                    </div>
                    <div className="space-y-2">
                      {ratingBreakdown.map(r => (
                        <div key={r.stars} className="flex items-center gap-2 text-sm">
                          <span className="w-8">{r.stars}★</span>
                          <Progress value={r.pct} className="h-2 flex-1" />
                          <span className="w-10 text-right text-muted-foreground">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  {mockReviews.map(review => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="w-3 h-3" /> {review.helpful} found helpful
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader><CardTitle>Available Slots This Week</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => {
                      const d = new Date(); d.setDate(d.getDate() + i);
                      const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
                      return (
                        <div key={i} className="p-4 bg-accent/50 rounded-xl border border-border">
                          <h4 className="font-semibold mb-3">{d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</h4>
                          <div className="flex flex-wrap gap-2">
                            {slots.slice(0, 3 + Math.floor(Math.random() * 3)).map(slot => (
                              <Badge key={slot} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                onClick={() => navigate("/consultations")}>{slot}</Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
