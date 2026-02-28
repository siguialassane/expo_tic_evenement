"use client";

import { motion } from "framer-motion";
import { ArrowLeft, UserCircle } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom est requis." }),
  lastName: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  company: z.string().optional(),
});

export default function ParticipantRegister() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert("Inscription réussie pour le participant !");
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
          <Card className="border-0 shadow-2xl shadow-primary/5">
            <CardHeader className="text-center pb-8 border-b border-slate-100">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex justify-center items-center rounded-2xl mb-6">
                <UserCircle size={32} />
              </div>
              <CardTitle className="text-3xl font-bold font-sans">Inscription Participant</CardTitle>
              <CardDescription className="text-base">
                Remplissez ce formulaire pour obtenir votre pass ExpoTic 2026.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Dupont" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse Email Professionnelle</FormLabel>
                        <FormControl>
                          <Input placeholder="jean.dupont@entreprise.com" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise (Optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="TechCorp" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    Confirmer l'inscription
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
