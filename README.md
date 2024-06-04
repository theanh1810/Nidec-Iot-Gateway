# Nidec-Iot-Gateway

### plan production
event: plan-production
payload:
{
    planId: string,
    plan: string,
    ver: string,
    his: string,
    status: number,
    product: string,
    mold: string,
    actualQty: number,
    planQty: number
}

event: get-plan-production
payload:
{
    planId: string,
    plan: string,
    ver: string,
    his: string,
    status: number,
    product: string,
    mold: string,
    actualQty: number,
    planQty: number
}

### change plan production
event: next-plan-production
payload: string (plan id)

event: prev-plan-production
payload: string (plan id)

event: next-product
payload: string (plan id)

### start plan production
event: start-plan-production
payload: string (plan id)

### end plan production
event: end-plan-production
payload: string (plan id)

## performance
event: performance
payload:
{
    a: number,
    p: number,
    q: number
}

## stock in machine
event: machine-stock
payload: number (stock in machine)
