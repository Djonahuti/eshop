import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserDetails } from "@/lib/appwrite";
import { useEffect, useState } from "react";



export default function Profile () {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string; contact: string; job: string; country: string; about: string; } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const userDataArray = await getUserDetails();
  
          if (Array.isArray(userDataArray) && userDataArray.length > 0) {
            const userData = userDataArray[0]; // Extract first object from array
            setUser({
              name: userData.admin_name,
              email: userData.admin_email,
              country: userData.admin_country,
              contact: userData.admin_contact,
              about: userData.admin_about,
              job: userData.admin_job,
              avatar: userData.admin_image,
            });
  
            setProfileImage(userData.admin_image); // Use avatar from Appwrite
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      fetchUserDetails();
    }, []);

    if (!user) return null; // Prevent rendering if user is not loaded

  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Profile Section */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            {profileImage && (
            <AvatarImage src={profileImage} alt="Profile" />
        )}
          </Avatar>
          <div className="space-y-2">
          <Label>I am a {user.job}</Label>
          <p className="text-accent-foreground text-xs">{user.about}</p>
          </div>
          
          <Button className="mt-4">Change image</Button>
        </CardContent>
      </Card>
      
      {/* Account Details */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder={user.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder={user.email} />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder={user.contact} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Location</Label>
            <Input placeholder={user.country} />
          </div>
          <Button className="col-span-2">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="password" placeholder="Current Password" />
          <Input type="password" placeholder="New Password" />
          <Input type="password" placeholder="Confirm Password" />
          <Button className="col-span-3">Save</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">Enable two-factor authentication for added security.</p>
          <Input className="mt-4" placeholder={user.contact} />
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">Deleting your account is permanent and cannot be undone.</p>
          <Button variant="destructive">I understand, delete my account</Button>
        </CardContent>
      </Card>
    </div>
        </div>
        </div>
    </div>
  )
}
