"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Le nom de l'entreprise est requis." }),
  contactName: z.string().min(2, { message: "Le nom du contact est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide." }),
  message: z.string().optional(),
});

export default function SponsorRegister() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert("Demande de sponsoring envoyée avec succès !");
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
            <CardHeader className="text-center pb-8 border-b border-slate-100">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex justify-center items-center rounded-2xl mb-6">
                <Briefcase size={32} />
              </div>
              <CardTitle className="text-3xl font-bold font-sans">Devenir Sponsor</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Associez votre marque à ExpoTic. Laissez-nous vos coordonnées pour être recontacté par notre équipe.
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
                          <FormLabel>Nom de l'entreprise</FormLabel>
                          <FormControl>
                            <Input placeholder="TechCorp" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 00 00 00 00" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage className="text-destructive font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Vos objectifs de sponsoring)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez brièvement vos attentes..." 
                            {...field} 
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    Envoyer ma demande
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
