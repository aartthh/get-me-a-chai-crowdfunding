// app/api/updateProfile/route.js
import { NextResponse } from 'next/server';
import { updateProfile } from '@/actions/useractions';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Received update request:', body);

        if (!body.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Use the updateProfile function from useractions which handles payment transfer
        const result = await updateProfile(body);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully',
                user: result.user  // Add this line
            });
        }

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}