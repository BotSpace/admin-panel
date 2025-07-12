"use client";

import { useState } from "react";
import { Download, Edit, Save, User, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock billing data
const billingHistory = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "$29.99",
    status: "To'langan",
    invoice: "INV-2024-001",
  },
  {
    id: 2,
    date: "2023-12-15",
    amount: "$29.99",
    status: "To'langan",
    invoice: "INV-2023-012",
  },
  {
    id: 3,
    date: "2023-11-15",
    amount: "$29.99",
    status: "To'langan",
    invoice: "INV-2023-011",
  },
  {
    id: 4,
    date: "2023-10-15",
    amount: "$29.99",
    status: "To'langan",
    invoice: "INV-2023-010",
  },
];

export function ProfileBilling() {
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [editedData, setEditedData] = useState(profileData);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Usage data
  const usageData = {
    bots: { current: 2, limit: 5 },
    subscribers: { current: 1450, limit: 5000 },
    messages: { current: 12500, limit: 50000 },
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfileData(editedData);
      setIsEditing(false);
    } else {
      // Start editing
      setEditedData(profileData);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log("Password change requested");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const calculatePercentage = (current: number, limit: number) => {
    return (current / limit) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil va Billing</h1>
        <p className="text-muted-foreground">
          Shaxsiy ma'lumotlaringiz va obuna sozlamalarini boshqaring
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - User Profile */}
        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Ma'lumotlari
              </CardTitle>
              <CardDescription>
                Shaxsiy ma'lumotlaringizni tahrirlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ism</Label>
                <Input
                  id="name"
                  value={isEditing ? editedData.name : profileData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedData.email : profileData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleEditToggle} className="gap-2">
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Saqlash
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      O'zgartirish
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Bekor qilish
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Parolni O'zgartirish</CardTitle>
              <CardDescription>
                Hisobingiz xavfsizligi uchun parolni yangilang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Joriy parol</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Yangi parol</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Yangi parolni tasdiqlang
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
              >
                Parolni Yangilash
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Billing & Subscription */}
        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Sizning Tarif Rejangiz
              </CardTitle>
              <CardDescription>
                Joriy obuna va foydalanish statistikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">Pro Plan</h3>
                <p className="text-muted-foreground">$29.99/oy</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Botlar</span>
                    <span className="font-medium">
                      {usageData.bots.current} / {usageData.bots.limit}
                    </span>
                  </div>
                  <Progress
                    value={calculatePercentage(
                      usageData.bots.current,
                      usageData.bots.limit
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Obunachilar</span>
                    <span className="font-medium">
                      {usageData.subscribers.current.toLocaleString()} /{" "}
                      {usageData.subscribers.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={calculatePercentage(
                      usageData.subscribers.current,
                      usageData.subscribers.limit
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Oylik xabarlar</span>
                    <span className="font-medium">
                      {usageData.messages.current.toLocaleString()} /{" "}
                      {usageData.messages.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={calculatePercentage(
                      usageData.messages.current,
                      usageData.messages.limit
                    )}
                  />
                </div>
              </div>

              <Button className="w-full" size="lg">
                Tarifni Yangilash yoki O'zgartirish
              </Button>
            </CardContent>
          </Card>

          {/* Billing History Card */}
          <Card>
            <CardHeader>
              <CardTitle>To'lovlar Tarixi</CardTitle>
              <CardDescription>
                Oxirgi to'lovlaringiz va hisob-fakturalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sana</TableHead>
                    <TableHead>Miqdor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {new Date(invoice.date).toLocaleDateString("uz-UZ")}
                      </TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Yuklab olish</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
