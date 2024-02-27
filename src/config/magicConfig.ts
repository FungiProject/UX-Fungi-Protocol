
export function getMagicApiKey(): string {
    return process.env.NEXT_PUBLIC_MAGIC_API_KEY || ""
}