"use client"

import { useEffect, useState } from "react"
import { Package, Tag, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getItems } from "@/lib/firebase/db"
import { Category, Product } from "@/types"
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await getItems("products") as Product[]
        
        const categories = await getItems("categories") as Category[]
        const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalValue,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  if (stats.loading) {
    return <DashboardSkeleton />
  }

  const statCards = [
    {
      title: "Всего товаров",
      value: `${stats.totalProducts} шт.`,
      description: "Доступно всего товаров",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Категории",
      value: `${stats.totalCategories} видов.`,
      description: "Различных категорий",
      icon: Tag,
      color: "text-green-600",
    },
    {
      title: "Общая стоимость",
      value: `${stats.totalValue.toLocaleString("uz-UZ")} с.`,
      description: "Товаров в каталоге",
      icon: DollarSign,
      color: "text-yellow-600",
    }
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Дэшборд</h1>
        <p className="text-muted-foreground mt-2">
          Обзор статистики каталога товаров
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription className="mt-1">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Дополнительные секции можно добавить здесь */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Управление каталогом товаров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Используйте навигацию слева для управления товарами и другими настройками.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
