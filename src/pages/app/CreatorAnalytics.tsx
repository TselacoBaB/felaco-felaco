
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Mock data
const viewsData = [
  { name: "Mon", views: 120 },
  { name: "Tue", views: 160 },
  { name: "Wed", views: 180 },
  { name: "Thu", views: 150 },
  { name: "Fri", views: 200 },
  { name: "Sat", views: 250 },
  { name: "Sun", views: 220 },
];

const earningsData = [
  { name: "Mon", amount: 15 },
  { name: "Tue", amount: 25 },
  { name: "Wed", amount: 35 },
  { name: "Thu", amount: 20 },
  { name: "Fri", amount: 30 },
  { name: "Sat", amount: 45 },
  { name: "Sun", amount: 40 },
];

const contentPerformance = [
  { name: "Post 1", views: 450, earnings: 25 },
  { name: "Post 2", views: 320, earnings: 18 },
  { name: "Post 3", views: 580, earnings: 35 },
  { name: "Post 4", views: 290, earnings: 15 },
  { name: "Post 5", views: 410, earnings: 22 },
];

const CreatorAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/creator-dashboard')}
        >
          Dashboard
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <Select defaultValue="7d">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Total Views</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">1,280</p>
            <p className="text-xs text-green-600">+18% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">$210</p>
            <p className="text-xs text-green-600">+24% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">New Subscribers</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-green-600">+5 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">6.8%</p>
            <p className="text-xs text-red-600">-0.5% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="views" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={viewsData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={earningsData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={contentPerformance}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="views" fill="#8884d8" name="Views" />
              <Bar yAxisId="right" dataKey="earnings" fill="#82ca9d" name="Earnings ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <Button 
          variant="outline"
          onClick={() => navigate('/app/creator-dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CreatorAnalytics;
