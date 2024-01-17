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
        "totalCheckouts": count(*[_type == "checkout"]),
        "totalCheckoutsThisYear": count(*[_type == "checkout" && checkoutDate >= '2024-01-01']),
        "totalPendingCheckouts": count(*[_type == "checkout" && !isCheckedOut && !isReturned]),
        "totalHotCheckouts": count(*[_type == "checkout" && isCheckedOut && !isReturned]),
        "totalCompletedCheckouts": count(*[_type == "checkout" && isCheckedOut && isReturned]),
        "totalUsers": count(*[_type == "user"]),
        "totalStaff": count(*[_type == "staff"])
      }`

      const { data: reports, error } = useFetch(reportsQuery) as {
        data: {
          totalCheckouts: number
          totalCheckoutsThisYear: number
          totalPendingCheckouts: number
          totalHotCheckouts: number
          totalCompletedCheckouts: number
          totalUsers: number
          totalStaff: number
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
                  Total Checkouts <b>Overall</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalCheckouts} />
                </p>
              </Button>
              <Button
                radius={3}
                padding={2}
                style={{ width: '100%', lineBreak: 'loose' }}
                mode="bleed"
              >
                <p>
                  Total Checkouts <b>This Year</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalCheckoutsThisYear} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Complted Checkouts</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalCompletedCheckouts} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Hot Checkouts</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalHotCheckouts} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Pending Checkouts</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={reports?.totalPendingCheckouts} />
                </p>
              </Button>
            </Grid>
          </Stack>
        </Container>
      )
    },
  }
}
