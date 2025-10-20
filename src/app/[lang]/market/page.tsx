"use client";

import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Heart,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import { useState, useMemo, useEffect } from "react";

// Mock data for templates
const categories = [
  { name: "E-commerce", count: 45, color: "bg-blue-500" },
  { name: "Utility", count: 32, color: "bg-green-500" },
  { name: "Entertainment", count: 28, color: "bg-purple-500" },
  { name: "Business", count: 24, color: "bg-orange-500" },
  { name: "Education", count: 18, color: "bg-pink-500" },
  { name: "Finance", count: 15, color: "bg-cyan-500" },
];

const templates = [
  {
    id: 1,
    title: "E-commerce Bot Pro",
    description:
      "Complete e-commerce solution with payment integration, inventory management, and customer support.",
    category: "E-commerce",
    price: "$49",
    priceValue: 49,
    rating: 4.8,
    downloads: 1240,
    image: "/modern-ecommerce-bot-interface.png",
    tags: ["Payments", "Inventory", "Support", "API", "Database"],
    author: "DevMaster",
  },
  {
    id: 2,
    title: "Task Manager Bot",
    description:
      "Organize your team's workflow with advanced task management and reminder features.",
    category: "Utility",
    price: "Free",
    priceValue: 0,
    rating: 4.6,
    downloads: 890,
    image: "/task-management-bot-dashboard.png",
    tags: ["Tasks", "Reminders", "Team", "Productivity"],
    author: "ProductiveCode",
  },
  {
    id: 3,
    title: "Quiz Master Bot",
    description:
      "Interactive quiz bot with multiple question types, scoring system, and leaderboards.",
    category: "Entertainment",
    price: "$29",
    priceValue: 29,
    rating: 4.9,
    downloads: 567,
    image: "/quiz-game-bot-interface.png",
    tags: ["Quiz", "Games", "Leaderboard", "Interactive"],
    author: "GameDev Studio",
  },
  {
    id: 4,
    title: "Customer Support Bot",
    description:
      "AI-powered customer support with ticket management and automated responses.",
    category: "Business",
    price: "$79",
    priceValue: 79,
    rating: 4.7,
    downloads: 432,
    image: "/customer-support-bot-chat.png",
    tags: ["AI", "Support", "Tickets", "Automation"],
    author: "SupportTech",
  },
  {
    id: 5,
    title: "Learning Assistant",
    description:
      "Educational bot with course management, progress tracking, and interactive lessons.",
    category: "Education",
    price: "$39",
    priceValue: 39,
    rating: 4.5,
    downloads: 321,
    image: "/educational-learning-bot.png",
    tags: ["Learning", "Courses", "Progress", "Education"],
    author: "EduBot Inc",
  },
  {
    id: 6,
    title: "Crypto Tracker Bot",
    description:
      "Real-time cryptocurrency tracking with price alerts and portfolio management.",
    category: "Finance",
    price: "$59",
    priceValue: 59,
    rating: 4.4,
    downloads: 298,
    image: "/cryptocurrency-tracker-bot.png",
    tags: ["Crypto", "Alerts", "Portfolio", "Real-time"],
    author: "CryptoDevs",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minDownloads, setMinDownloads] = useState(0);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const popularSearches = [
    "e-commerce bot",
    "payment integration",
    "task manager",
    "quiz bot",
    "customer support",
    "AI chatbot",
    "crypto tracker",
    "learning assistant",
    "inventory management",
    "reminder bot",
    "game bot",
    "business automation",
  ];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    templates.forEach((template) => authors.add(template.author));
    return Array.from(authors).sort();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const suggestions = popularSearches
        .filter((search) =>
          search.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          template.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Price filter
    if (priceFilter === "free") {
      filtered = filtered.filter((template) => template.price === "Free");
    } else if (priceFilter === "paid") {
      filtered = filtered.filter((template) => template.price !== "Free");
    }

    filtered = filtered.filter(
      (template) =>
        template.priceValue >= priceRange[0] &&
        template.priceValue <= priceRange[1]
    );

    // Rating filter
    if (ratingFilter === "4+") {
      filtered = filtered.filter((template) => template.rating >= 4);
    } else if (ratingFilter === "3+") {
      filtered = filtered.filter((template) => template.rating >= 3);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((template) =>
        selectedTags.some((tag) => template.tags.includes(tag))
      );
    }

    if (minDownloads > 0) {
      filtered = filtered.filter(
        (template) => template.downloads >= minDownloads
      );
    }

    if (selectedAuthors.length > 0) {
      filtered = filtered.filter((template) =>
        selectedAuthors.includes(template.author)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].reverse();
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.priceValue - a.priceValue);
        break;
      default: // popular
        filtered = [...filtered].sort((a, b) => b.downloads - a.downloads);
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    priceFilter,
    ratingFilter,
    sortBy,
    selectedTags,
    priceRange,
    minDownloads,
    selectedAuthors,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchResults(true);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setShowSuggestions(false);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceFilter("all");
    setRatingFilter("all");
    setSelectedTags([]);
    setPriceRange([0, 100]);
    setMinDownloads(0);
    setSelectedAuthors([]);
    setShowSearchResults(false);
    setShowSuggestions(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceFilter !== "all") count++;
    if (ratingFilter !== "all") count++;
    if (selectedTags.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 100) count++;
    if (minDownloads > 0) count++;
    if (selectedAuthors.length > 0) count++;
    return count;
  }, [
    selectedCategory,
    priceFilter,
    ratingFilter,
    selectedTags,
    priceRange,
    minDownloads,
    selectedAuthors,
  ]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAuthorToggle = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {!showSearchResults ? (
        <>
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Telegram Bot Templates
                <span className="block text-primary">for Developers</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build powerful Telegram bots faster with our collection of
                professional, ready-to-use code templates. From e-commerce to
                entertainment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent"
                >
                  Submit Template
                </Button>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-foreground">
                  Categories
                </h3>
                <Button variant="ghost" className="text-primary">
                  See All →
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.name}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowSearchResults(true);
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {category.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {category.count} templates
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-8 px-4 border-b border-border">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : selectedCategory !== "all"
                    ? `${selectedCategory} Templates`
                    : "All Templates"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredTemplates.length} template
                  {filteredTemplates.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All ({activeFilterCount})
                  </Button>
                )}
              </div>
            </div>

            {(selectedTags.length > 0 ||
              selectedAuthors.length > 0 ||
              activeFilterCount > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedAuthors.map((author) => (
                  <Badge
                    key={author}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleAuthorToggle(author)}
                  >
                    by {author} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Filters and Templates */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Filters</h4>
                <Popover
                  open={showAdvancedFilters}
                  onOpenChange={setShowAdvancedFilters}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sliders className="h-4 w-4 mr-2" />
                      Advanced
                      {activeFilterCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-5 w-5 p-0 text-xs"
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Advanced Filters</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                        >
                          Clear All
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Price Range
                        </label>
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={100}
                            min={0}
                            step={5}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Minimum Downloads
                        </label>
                        <Select
                          value={minDownloads.toString()}
                          onValueChange={(value) =>
                            setMinDownloads(Number.parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="100">100+</SelectItem>
                            <SelectItem value="500">500+</SelectItem>
                            <SelectItem value="1000">1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tags
                        </label>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {allTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={tag}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => handleTagToggle(tag)}
                              />
                              <label
                                htmlFor={tag}
                                className="text-sm cursor-pointer"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Authors
                        </label>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {allAuthors.map((author) => (
                            <div
                              key={author}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={author}
                                checked={selectedAuthors.includes(author)}
                                onCheckedChange={() =>
                                  handleAuthorToggle(author)
                                }
                              />
                              <label
                                htmlFor={author}
                                className="text-sm cursor-pointer"
                              >
                                {author}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price
                  </label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rating
                  </label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="4+">4+ stars</SelectItem>
                      <SelectItem value="3+">3+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Sort by
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Most popular" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest rated</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  {showSearchResults ? "Results" : "Popular Templates"}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 p-0 text-xs"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={template.image || "/placeholder.svg"}
                          alt={template.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {template.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              by {template.author}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-medium">
                                {template.rating}
                              </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{template.downloads}</span>
                            </div>
                          </div>
                          <span className="font-bold text-lg text-primary">
                            {template.price}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Get Template
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No templates found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}

              {filteredTemplates.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Templates
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">BotMarket</h4>
              <p className="text-sm text-muted-foreground">
                The ultimate marketplace for Telegram bot templates and code
                solutions.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Categories</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    E-commerce
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Utility
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Entertainment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Business
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Submit Template
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 BotMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
