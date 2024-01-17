import { Button, Card, Container, Grid, Stack } from '@sanity/ui'
import AnimatedNumber from 'components/AnimatedNumber'
import { useFetch } from 'hooks/useFetch'
import { groq } from 'next-sanity'
import { Tool } from 'sanity'

// TODO: most common items checked,
// TODO: tax related stats, total checkouts, total members, total value of inventory

export default function ReportsTool(): Tool {
  return {
    name: 'reports',
    title: 'Reports',
    component: () => {
      const reportsQuery = groq`
      {
        "totalRentals": count(*[_type == "checkout"]),
        "totalRentalsThisYear": count(*[_type == "checkout" && checkoutDate >= '2024-01-01']),
        "totalPendingRentals": count(*[_type == "checkout" && !isCheckedOut && !isReturned]),
        "totalHotRentals": count(*[_type == "checkout" && isCheckedOut && !isReturned]),
        "totalCompletedRentals": count(*[_type == "checkout" && isCheckedOut && isReturned]),
        "totalUsers": count(*[_type == "member"]),
        "totalActiveUsers": count(*[_type == "member" && count(*[_type == "checkout" && references(^._id)]) > 0]),
        "totalStaff": count(*[_type == "staff"])
      }`

      const { data: reports, error } = useFetch(reportsQuery) as {
        data: {
          totalRentals: number
          totalRentalsThisYear: number
          totalPendingRentals: number
          totalHotRentals: number
          totalCompletedRentals: number
          totalUsers: number
          totalStaff: number
          totalActiveUsers: number
        }
        error: any
      }

      return (
        <Container width={[1, 2, 2]} padding={3}>
          <Stack space={3}>
            <Card tone="primary" padding={2} shadow={1} radius={3}>
              Reports
            </Card>
            <Grid columns={2} gap={3}>
              <Button
                radius={3}
                padding={2}
                style={{ width: '100%', lineBreak: 'loose' }}
                mode="bleed"
              >
                <p>
                  Total Rentals <b>To Date</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalRentals} />
                </p>
              </Button>
              <Button
                radius={3}
                padding={2}
                style={{ width: '100%', lineBreak: 'loose' }}
                mode="bleed"
              >
                <p>
                  Total Rentals <b>This Year</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalRentalsThisYear} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Hot Rentals</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalHotRentals} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Pending Rentals</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalPendingRentals} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Users</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalUsers} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Active Users</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalActiveUsers} />
                </p>
              </Button>
            </Grid>
          </Stack>
        </Container>
      )
    },
  }
}
