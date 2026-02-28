"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Le nom requiert au moins 2 caractères." }),
  contactName: z.string().min(2, { message: "Nom et prénom requis." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  standSize: z.string().min(1, { message: "Veuillez sélectionner une taille de stand." }),
  sector: z.string().min(2, { message: "Le secteur est requis." }),
});

export default function ExhibitorRegister() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      standSize: "",
      sector: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert("Demande de stand enregistrée ! Notre équipe va vous contacter.");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-6">
      <div className="max-w-2xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-2xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
            <CardHeader className="text-center pb-8 border-b border-slate-100">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex justify-center items-center rounded-2xl mb-6">
                <Building2 size={32} />
              </div>
              <CardTitle className="text-3xl font-bold font-sans">Réserver un Stand</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Exposez vos solutions lors d'ExpoTic. Un conseiller vous accompagnera pour finaliser votre dossier.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise/start-up</FormLabel>
                          <FormControl>
                            <Input placeholder="TechCorp" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secteur d'activité</FormLabel>
                          <FormControl>
                            <Input placeholder="IA, Cybersécurité, FinTech..." {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personne à contacter</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Professionnel</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@entreprise.com" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="standSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taille de stand souhaitée</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Sélectionnez une option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="9m2">9 m² (Start-up / PME)</SelectItem>
                            <SelectItem value="18m2">18 m² (Standard)</SelectItem>
                            <SelectItem value="36m2">36 m² (Premium)</SelectItem>
                            <SelectItem value="custom">Sur mesure</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    Solliciter une réservation
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
